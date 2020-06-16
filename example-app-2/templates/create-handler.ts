/** $$COMMENT */
router.post("$$PATH", async (req, res) => {
  await client.connect();
  try {
    /** @todo request body to prisma args */
    await $$DELEGATE.create({ data: req.body });
    res.status(201).end();
  } catch (error) {
    console.error(error);
    res.status(500).end();
  } finally {
    await client.disconnect();
  }
});
