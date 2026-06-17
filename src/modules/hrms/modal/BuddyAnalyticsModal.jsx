import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const BuddyAnalyticsModal = ({
  isOpen,
  onClose,
  selectedProgram,
  handleExportData
}) => {
  const analytics = selectedProgram ? selectedProgram.analytics : null;

  if (!analytics) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Program Analytics - ${selectedProgram.name}`}
      size="xl"
    >
      <div className="space-y-4 sm:space-y-6 sm:p-2">

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3">
          <div className="border border-slate-200 bg-slate-50/50 p-3 sm:p-4 rounded-xl sm:rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 block">Total Pairs</span>
            <div className="mt-1 sm:mt-2 flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-bold text-slate-800">{analytics.totalPairs}</span>
            </div>
            <span className="text-[8px] sm:text-[10px] text-slate-400 mt-1">Active: {analytics.activePairs}</span>
          </div>

          <div className="border border-slate-200 bg-slate-50/50 p-3 sm:p-4 rounded-xl sm:rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 block">Completion Rate</span>
            <div className="mt-1 sm:mt-2 flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-bold text-emerald-600">{analytics.completionRate}%</span>
            </div>
            <span className="text-[8px] sm:text-[10px] text-slate-400 mt-1">{analytics.completedPairs} completed</span>
          </div>

          <div className="border border-slate-200 bg-slate-50/50 p-3 sm:p-4 rounded-xl sm:rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 block">Avg Rating</span>
            <div className="mt-1 sm:mt-2 flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-bold text-amber-500">{analytics.averageRating}/5</span>
            </div>
            <span className="text-[8px] sm:text-[10px] text-slate-400 mt-1">{analytics.feedbackCount} feedback submissions</span>
          </div>

          <div className="border border-slate-200 bg-slate-50/50 p-3 sm:p-4 rounded-xl sm:rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 block">Avg Match Score</span>
            <div className="mt-1 sm:mt-2 flex items-baseline gap-1.5">
              <span className="text-xl sm:text-xl font-bold text-blue-600">{Number(analytics.averageMatchScore).toFixed(1)}/100</span>
            </div>
            <span className="text-[8px] sm:text-[10px] text-slate-400 mt-1">Pairing compatibility quality</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="border border-slate-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 space-y-3">
            <h6 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Icon icon="heroicons:building-office" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />
              Department Distribution
            </h6>
            <div className="space-y-2.5 sm:space-y-3">
              {(() => {
                const deptEntries = Object.entries(analytics.departmentDistribution || {});
                const totalDeptCount = deptEntries.reduce((sum, [_, count]) => sum + Number(count), 0) || 1;

                return deptEntries.map(([dept, count]) => {
                  const percentage = Math.min((Number(count) / totalDeptCount) * 100, 100);
                  return (
                    <div key={dept} className="space-y-1">
                      <div className="flex justify-between text-[10px] sm:text-xs font-medium text-slate-600">
                        <span className="truncate max-w-[60%]">{dept}</span>
                        <span>{count} pairs</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 sm:h-2">
                        <div
                          className="bg-blue-500 h-1.5 sm:h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                });
              })()}
              {(!analytics.departmentDistribution || Object.keys(analytics.departmentDistribution).length === 0) && (
                <div className="text-[10px] sm:text-xs text-slate-400 text-center py-4">No data available</div>
              )}
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 space-y-3">
            <h6 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Icon icon="heroicons:map-pin" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
              Location Distribution
            </h6>
            <div className="space-y-2.5 sm:space-y-3">
              {(() => {
                const locEntries = Object.entries(analytics.locationDistribution || {});
                const totalLocCount = locEntries.reduce((sum, [_, count]) => sum + Number(count), 0) || 1;

                return locEntries.map(([loc, count]) => {
                  const percentage = Math.min((Number(count) / totalLocCount) * 100, 100);
                  return (
                    <div key={loc} className="space-y-1">
                      <div className="flex justify-between text-[10px] sm:text-xs font-medium text-slate-600">
                        <span className="truncate max-w-[60%]">{loc}</span>
                        <span>{count} pairs</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 sm:h-2">
                        <div
                          className="bg-emerald-500 h-1.5 sm:h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                });
              })()}
              {(!analytics.locationDistribution || Object.keys(analytics.locationDistribution).length === 0) && (
                <div className="text-[10px] sm:text-xs text-slate-400 text-center py-4">No data available</div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="border border-slate-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 space-y-3 sm:space-y-4">
            <h6 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Icon icon="heroicons:heart" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-500" />
              Satisfaction Metrics
            </h6>
            <div className="space-y-2.5 sm:space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] sm:text-xs font-medium text-slate-600">
                  <span>Satisfaction Score</span>
                  <span className="font-bold text-slate-800">{analytics.satisfactionScore}/5</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 sm:h-2.5">
                  <div
                    className="bg-amber-400 h-2 sm:h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${(analytics.satisfactionScore / 5) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 text-[10px] sm:text-xs border-t border-slate-100">
                <span className="text-slate-600">Time to Productivity</span>
                <span className="font-bold text-slate-800">{analytics.timeToProductivity}</span>
              </div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 space-y-3 sm:space-y-4">
            <h6 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Icon icon="heroicons:check-badge" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500" />
              Performance Overview
            </h6>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center">
              <div className="bg-slate-50 p-2 sm:p-3 rounded-lg sm:rounded-xl border border-slate-100">
                <div className="text-base sm:text-lg font-bold text-blue-600">{analytics.activePairs}</div>
                <div className="text-[8px] sm:text-[10px] text-slate-500 mt-0.5">Active Pairs</div>
              </div>
              <div className="bg-slate-50 p-2 sm:p-3 rounded-lg sm:rounded-xl border border-slate-100">
                <div className="text-base sm:text-lg font-bold text-emerald-600">{analytics.completedPairs}</div>
                <div className="text-[8px] sm:text-[10px] text-slate-500 mt-0.5">Completed</div>
              </div>
              <div className="bg-slate-50 p-2 sm:p-3 rounded-lg sm:rounded-xl border border-slate-100">
                <div className="text-base sm:text-lg font-bold text-amber-500">{analytics.feedbackCount}</div>
                <div className="text-[8px] sm:text-[10px] text-slate-500 mt-0.5">Feedback</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            className="w-full sm:w-auto px-4 py-2.5 sm:py-2 border border-slate-200 text-slate-600 rounded-xl text-xs sm:text-sm font-semibold hover:bg-slate-50 transition-colors"
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="button"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 bg-blue-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-blue-700 transition-colors"
            onClick={() => handleExportData("analytics")}
          >
            <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default BuddyAnalyticsModal;