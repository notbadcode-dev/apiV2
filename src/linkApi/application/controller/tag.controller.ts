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

    // @Authority
    // @Get('/')
    // // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
    // async getLinkList(@Req() req: Request): Promise<ILink[]> {
    //     const RESULT: ILink[] = await this._linkService.getLinkList();
    //     return RESULT;
    // }

    @Authority
    @Delete('/:id')
    async deleteLink(@Req() req: Request, @Param('id') tagId: number): Promise<boolean> {
        const RESULT: boolean = await this._tagService.deleteTag(tagId);
        return RESULT;
    }
}
