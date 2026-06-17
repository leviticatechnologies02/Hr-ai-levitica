import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../shared/components/Modal';

const BuddyChecklistModal = ({
  isOpen,
  onClose,
  selectedProgram,
  handleUpdateTaskStatus
}) => {
  const program = selectedProgram;

  if (!program) return null;

  const completedTasks = program.buddyResponsibilities
    ?.flatMap((c) => c.tasks)
    .filter((t) => t.status === "completed").length || 0;

  const totalTasks = program.buddyResponsibilities?.flatMap((c) => c.tasks).length || 0;

  const completionPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const getTaskStatusBadge = (status) => {
    const badges = {
      completed: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      'in-progress': 'bg-amber-50 text-amber-700 border-amber-100',
      pending: 'bg-slate-50 text-slate-600 border-slate-150',
      overdue: 'bg-rose-50 text-rose-700 border-rose-100',
      cancelled: 'bg-slate-100 text-slate-600 border-slate-200',
    };
    const styleClass = badges[status] || 'bg-blue-50 text-blue-700 border-blue-100';
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${styleClass}`}>
        {status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      high: 'bg-rose-50 text-rose-700 border-rose-100',
      medium: 'bg-amber-50 text-amber-700 border-amber-100',
      low: 'bg-sky-50 text-sky-700 border-sky-100',
    };
    const styleClass = badges[priority] || 'bg-slate-50 text-slate-600 border-slate-150';
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${styleClass}`}>
        {priority?.toUpperCase()}
      </span>
    );
  };

  const handleExportChecklist = () => {
    if (!program || !program.buddyResponsibilities?.length) return;

    const headers = [
      "Program Name",
      "Category",
      "Task",
      "Description",
      "Priority",
      "Status",
      "Deadline",
      "Assigned To",
    ];

    const rows = [];

    program.buddyResponsibilities.forEach((category) => {
      category.tasks?.forEach((task) => {
        rows.push([
          program.name,
          category.category,
          task.task,
          task.description || "",
          task.priority || "",
          task.status,
          task.deadline || "",
          task.assignedTo || "",
        ]);
      });
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `Buddy_Checklist_${program.name.replace(/\s+/g, "_")}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Buddy Responsibilities Checklist – ${program.name}`}
      size="xl"
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
          <div className="space-y-1 flex-grow">
            <div className="text-xs font-semibold text-slate-500">Program Progress</div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-slate-800">{completedTasks} of {totalTasks} tasks completed</span>
              <span className="text-xs font-bold text-emerald-600">({completionPercentage}% complete)</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 max-w-xs mt-1">
              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${completionPercentage}%` }} />
            </div>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors shadow-sm"
            onClick={handleExportChecklist}
          >
            <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4" />
            Export Checklist (CSV)
          </button>
        </div>

        <div className="space-y-6">
          {program.buddyResponsibilities?.map((category) => (
            <div key={category.id} className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
              <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-200 flex justify-between items-center">
                <span className="text-sm font-extrabold text-slate-800">{category.category}</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                  {category.tasks?.filter((t) => t.status === "completed").length}/{category.tasks?.length}
                </span>
              </div>

              <div className="divide-y divide-slate-150">
                {category.tasks?.map((task) => (
                  <div key={task.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50/20 transition-colors">
                    <div className="space-y-1.5 flex-grow">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-slate-800">{task.task}</span>
                        {getPriorityBadge(task.priority)}
                      </div>
                      <p className="text-xs text-slate-500 max-w-2xl">{task.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-400">
                        <span className="inline-flex items-center gap-1">
                          <Icon icon="heroicons:calendar" className="w-3.5 h-3.5" />
                          Deadline: {task.deadline || "—"}
                        </span>
                        {task.assignedTo && (
                          <span className="inline-flex items-center gap-1">
                            <Icon icon="heroicons:user" className="w-3.5 h-3.5" />
                            Assigned To: {task.assignedTo}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0 self-end sm:self-center">
                      {getTaskStatusBadge(task.status)}
                      <div className="flex border border-slate-200 rounded-lg overflow-hidden shadow-sm bg-white">
                        <button
                          type="button"
                          className={`p-1.5 text-xs hover:bg-slate-50 border-r border-slate-150 ${task.status === "completed" ? "bg-emerald-50 text-emerald-600" : "text-slate-400"}`}
                          onClick={() => handleUpdateTaskStatus(program.id, task.id, "completed")}
                          disabled={task.status === "completed"}
                          title="Mark Completed"
                        >
                          <Icon icon="heroicons:check" className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          className={`p-1.5 text-xs hover:bg-slate-50 border-r border-slate-150 ${task.status === "in-progress" ? "bg-amber-50 text-amber-600" : "text-slate-400"}`}
                          onClick={() => handleUpdateTaskStatus(program.id, task.id, "in-progress")}
                          disabled={task.status === "in-progress"}
                          title="Mark In Progress"
                        >
                          <Icon icon="heroicons:clock" className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          className={`p-1.5 text-xs hover:bg-slate-50 ${task.status === "pending" ? "bg-slate-100 text-slate-700" : "text-slate-400"}`}
                          onClick={() => handleUpdateTaskStatus(program.id, task.id, "pending")}
                          disabled={task.status === "pending"}
                          title="Mark Pending"
                        >
                          <Icon icon="heroicons:minus" className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <small className="text-slate-400 flex items-center gap-1">
            <Icon icon="heroicons:information-circle" className="w-4 h-4" />
            Checklist updates are saved instantly.
          </small>
          <button
            type="button"
            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default BuddyChecklistModal;
