interface RemainingTime {
  text: string;
  isExpired: boolean;
}

export function getRemainingTime(deadline: number): RemainingTime {
  const diff = deadline - Date.now();

  if (diff <= 0) {
    return { text: '已过期', isExpired: true };
  }

  const totalMinutes = Math.floor(diff / 60000);
  const totalHours = Math.floor(diff / 3600000);
  const totalDays = Math.floor(diff / 86400000);

  if (totalDays >= 1) {
    return { text: `${totalDays} 天`, isExpired: false };
  }

  const remainingHours = totalHours;
  const remainingMinutes = totalMinutes % 60;

  if (remainingHours > 0) {
    return { text: `${remainingHours}小时${remainingMinutes}分钟`, isExpired: false };
  }

  return { text: `${remainingMinutes}分钟`, isExpired: false };
}

let idCounter = 0;

export function generateId(): string {
  idCounter += 1;
  return `${Date.now()}-${idCounter}-${Math.random().toString(36).slice(2, 8)}`;
}
