import { IAutocompleteResult } from '@model/autocomplete/autocomplete-result.model';
import { IAutocompleteSearch } from '@model/autocomplete/autocomplete-search.model';
import { ITagCreate } from '@model/tag/tag-create.model';
import { ITag } from '@model/tag/tag.model';
import { Authority } from '@service/decorator/authority.decorator';
import { TagService, TAG_SERVICE_TOKEN } from '@service/tag.service/tag.service';
import { Request } from 'express';
import { Body, Delete, JsonController, Param, Post, Req } from 'routing-controllers';
import { Inject, Service } from 'typedi';

@Service()
@JsonController('/tag')
export class UserController {
    constructor(@Inject(TAG_SERVICE_TOKEN) private _tagService: TagService) {}

    @Authority
    @Post('/')
    async createLink(@Req() req: Request, @Body() tagCreate: ITagCreate): Promise<ITag> {
        const RESULT: ITag = await this._tagService.createTag(tagCreate);
        return RESULT;
    }

    @Authority
    @Post('/autocomplete/')
    async getAutocomplete(@Req() req: Request, @Body() tagAutocompleteSearch: IAutocompleteSearch): Promise<IAutocompleteResult<ITag>> {
        const RESULT: IAutocompleteResult<ITag> = await this._tagService.getAutocomplete(tagAutocompleteSearch);
        return RESULT;
    }

    @Authority
    @Delete('/:id')
    async deleteLink(@Req() req: Request, @Param('id') tagId: number): Promise<boolean> {
        const RESULT: boolean = await this._tagService.deleteTag(tagId);
        return RESULT;
    }
}
