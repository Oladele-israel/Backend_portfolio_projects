export const ExtractLastStatusCheck = (websites) =>
  websites.map((website) => {
    const lastStatusCheck =
      website.statusChecks[website.statusChecks.length - 1];
    return {
      url: website.url,
      id: website.id,
      isUp: lastStatusCheck.isUp,
      responseTime: lastStatusCheck.responseTime,
      checkedAt: lastStatusCheck.checkedAt,
    };
  });
