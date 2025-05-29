import colors from '../data/playersColors.json'

export function getUsedColors(participants) {
  return participants.map(p => p.color?.color).filter(Boolean);
}

export function getAvailableColors(participants) {
  const used = getUsedColors(participants);
  return colors.filter(c => !used.includes(c.color));
}

export function assignColor(participants) {
  const available = getAvailableColors(participants);
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}

export function isColorAvailable(participants, color, excludeId = null) {
  const usedByOthers = participants
    .filter(p => p.id !== excludeId)
    .map(p => p.color.color);
  return !usedByOthers.includes(color);
}