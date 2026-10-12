// Branch (Company Location) selection utilities.
// Only meaningful for the 'company' role today — 'admin' users are branch-
// locked server-side (see core/dependencies.py get_current_location_id) and
// never get a selector, they just see a read-only badge for their branch.

import { BASE_URL } from '../constants/api.config';

const SELECTED_BRANCH_KEY = 'selectedBranchId';

// Returns the selected branch id as a string, or null for "All Branches".
export const getSelectedBranchId = () => {
  const v = localStorage.getItem(SELECTED_BRANCH_KEY);
  return v && v !== 'all' ? v : null;
};

// Pass null/undefined to select "All Branches".
export const setSelectedBranchId = (locationId) => {
  if (locationId === null || locationId === undefined) {
    localStorage.removeItem(SELECTED_BRANCH_KEY);
  } else {
    localStorage.setItem(SELECTED_BRANCH_KEY, String(locationId));
  }
  // Broadcast so any open listeners (e.g. list pages) can react without a
  // full reload if they choose to; BranchSelector itself reloads the page
  // by default to keep this simple and correct everywhere at once.
  window.dispatchEvent(new CustomEvent('branchchange', { detail: { locationId } }));
};

export const clearSelectedBranch = () => {
  localStorage.removeItem(SELECTED_BRANCH_KEY);
};

// One wrapper around fetch() for every request to our API.
//  1. Adds the selected branch (X-Location-Id). Only apiCall() did this before; the recruitment pages call
//     fetch() directly, so the server never knew which branch was picked. The server only honours it for
//     company / super admin users.
//  2. If the server rejects the STAFF login token (401) the session is stale - e.g. the server's secret key
//     changed, or the token expired. Before this, every screen silently showed "0" / demo data. Now the user
//     is told once and sent to the login page.
const AUTH_PAGES = /\/(login|signup|forgot|reset|otp|verify)/i;

const readHeader = (input, init, name) => {
  try {
    const h = new Headers(init.headers || (typeof input !== 'string' && input ? input.headers : undefined));
    return h.get(name);
  } catch (e) {
    return null;
  }
};

export const installBranchHeaderOnFetch = () => {
  if (typeof window === 'undefined' || window.__branchFetchInstalled) return;
  window.__branchFetchInstalled = true;
  const originalFetch = window.fetch.bind(window);
  let sessionExpiredHandled = false;

  window.fetch = async (input, init = {}) => {
    const url = typeof input === 'string' ? input : (input && input.url) || '';
    const isApi = url.startsWith(BASE_URL);

    if (isApi) {
      try {
        const branchId = getSelectedBranchId();
        if (branchId) {
          const headers = new Headers(init.headers || (typeof input !== 'string' && input ? input.headers : undefined));
          if (!headers.has('X-Location-Id')) headers.set('X-Location-Id', String(branchId));
          init = { ...init, headers };
        }
      } catch (e) {
        // never block a request because of this helper
      }
    }

    const response = await originalFetch(input, init);

    if (isApi && response.status === 401 && !sessionExpiredHandled && !AUTH_PAGES.test(url)) {
      const stored = localStorage.getItem('token');
      // Only when the rejected request carried OUR stored staff token (candidate/OTP flows use others).
      if (stored && readHeader(input, init, 'Authorization') === `Bearer ${stored}`) {
        sessionExpiredHandled = true;
        ['token', 'refreshToken', 'userRole', 'userEmail', 'requiresPasswordChange', 'needsProfileCompletion']
          .forEach((k) => localStorage.removeItem(k));
        clearSelectedBranch();
        alert('Your session has expired or is no longer valid. Please log in again.');
        window.location.assign('/login');
      }
    }
    return response;
  };
};
