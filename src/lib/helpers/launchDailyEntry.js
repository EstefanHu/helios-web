// Opens today's daily entry if it is already loaded, otherwise lets /write find or create it.
export const launchDailyEntry = (daily, router) => {
  router.push(`/write?v=daily${daily?.slug ? '&s=' + daily.slug : ''}`);
};
