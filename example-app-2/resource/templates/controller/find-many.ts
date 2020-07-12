/** $$COMMENT$$ */
@Get()
findMany(@Query() query): Promise<$$ENTITY$$[]> {
    return this.service.findMany(query);
}