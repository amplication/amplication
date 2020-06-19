/** $$COMMENT */
router.get("$$PATH", async (req, res) => {
  await client.connect();
  try {
    /** @todo smarter parameters to prisma args */
    const results = await client.$$DELEGATE.findMany({
      where: req.params,
    });
    res.end(JSON.stringify(results));
  } catch (error) {
    console.error(error);
    res.status(500).end();
  } finally {
    await client.disconnect();
  }
});
