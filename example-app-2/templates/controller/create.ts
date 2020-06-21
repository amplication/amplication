/** $$COMMENT$$ */
@Post()
create(@Query() query, @Body() data): Promise<$$ENTITY$$> {
    return this.service.create({ ...query, data });
}