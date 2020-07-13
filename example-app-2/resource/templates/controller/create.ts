/** $$COMMENT$$ */
@Post()
create(@Query() query, @Body() data: $$BODY_TYPE$$): Promise<$$ENTITY$$> {
    return this.service.create({ ...query, data });
}