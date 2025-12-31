
import { Subject, AttendanceMetrics } from '../types';

export const calculateMetrics = (subject: Subject, target: number): AttendanceMetrics => {
  const total = subject.history.length;
  const attended = subject.history.filter(h => h.type === 'present').length;
  const percentage = total === 0 ? 0 : (attended / total) * 100;
  const targetDecimal = target / 100;

  let safeToBunk = 0;
  let mustAttend = 0;

  if (total === 0) {
    return { total, attended, percentage, safeToBunk: 0, mustAttend: 0, status: 'safe' };
  }

  if (percentage >= target) {
    // How many more can we miss?
    // (Attended) / (Total + X) >= TargetDecimal
    // Attended / TargetDecimal >= Total + X
    // X = floor(Attended / TargetDecimal - Total)
    safeToBunk = Math.floor(attended / targetDecimal - total);
  } else {
    // How many consecutive must we attend?
    // (Attended + X) / (Total + X) >= TargetDecimal
    // Attended + X >= TargetDecimal * Total + TargetDecimal * X
    // X - TargetDecimal * X >= TargetDecimal * Total - Attended
    // X(1 - TargetDecimal) >= TargetDecimal * Total - Attended
    // X = ceil((TargetDecimal * Total - Attended) / (1 - TargetDecimal))
    mustAttend = Math.ceil((targetDecimal * total - attended) / (1 - targetDecimal));
  }

  let status: 'safe' | 'warning' | 'critical' = 'safe';
  if (percentage < target) {
    status = 'critical';
  } else if (percentage === target || (percentage > target && percentage < target + 5)) {
    status = 'warning';
  }

  return {
    total,
    attended,
    percentage,
    safeToBunk: Math.max(0, safeToBunk),
    mustAttend: Math.max(0, mustAttend),
    status
  };
};

export const getGlobalMetrics = (subjects: Subject[], target: number) => {
  let totalClasses = 0;
  let totalAttended = 0;
  
  subjects.forEach(s => {
    totalClasses += s.history.length;
    totalAttended += s.history.filter(h => h.type === 'present').length;
  });

  const percentage = totalClasses === 0 ? 0 : (totalAttended / totalClasses) * 100;
  return {
    percentage,
    isAboveTarget: percentage >= target,
    totalClasses,
    totalAttended
  };
};
