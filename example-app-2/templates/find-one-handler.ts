/** $$COMMENT */
router.get("$$PATH", async (req, res) => {
  await client.connect();
  try {
    /** @todo smarter parameters to prisma args */
    const result = await client.$$DELEGATE.findOne({
      where: req.params,
    });
    res.end(JSON.stringify(result));
  } catch (error) {
    console.error(error);
    res.status(500).end();
  } finally {
    await client.disconnect();
  }
});
