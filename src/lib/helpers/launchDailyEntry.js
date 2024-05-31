export const launchDailyEntry = (entries, router) => {
  let res;
  const today = new Date();
  for (let i = 0; i < entries.length; i++) {
    if (today.setHours(0, 0, 0, 0) !== entries[i].createdAt.setHours(0, 0, 0, 0)) break;
    if (entries[i].journeyId !== null) continue;
    res = entries[i].slug;
    break;
  }

  router.push(`/write?v=daily${res ? '&s=' + res : ''}`);
};
