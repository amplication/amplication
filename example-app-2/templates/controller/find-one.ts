/** $$COMMENT$$ */
@Get("$$PATH$$")
findOne(@Query() query, @Param() params): Promise<$$ENTITY$$> {
    const entity =  await this.service.findOne({ ...query, where: params });
    if (entity === null) {
        throw new NotFoundException(`No entity was found for ${JSON.stringify(query)}`)
    }
    return entity;
}