/** $$COMMENT$$ */
@Get("$$PATH$$")
findOne(@Query() query, @Param() params): Promise<$$ENTITY$$> {
    return this.service.findOne({ ...query, where: params });
}