export const pingWebsite = async (url, userId) => {
  const startTime = Date.now();
  try {
    const response = await axios.get(url);
    const responseTime = Date.now() - startTime;

    await prisma.Check.create({
      data: {
        website: {
          connectOrCreate: {
            where: { url },
            create: { url, userId },
          },
        },
        responseTime,
        statusCode: response.status,
        isUp: true,
      },
    });

    return { isUp: true, responseTime, statusCode: response.status };
  } catch (error) {
    await prisma.Check.create({
      data: {
        website: {
          connectOrCreate: {
            where: { url },
            create: { url, userId },
          },
        },
        responseTime: -1,
        statusCode: error.response?.status || 500,
        isUp: false,
      },
    });

    return {
      isUp: false,
      responseTime: -1,
      statusCode: error.response?.status || 500,
    };
  }
};
