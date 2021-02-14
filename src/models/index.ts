import { model } from 'mongoose';

import { user, IUser } from './user'
import { page, IPage } from './page'
import { image, IImage } from './image'
import { story, IStory } from './story'
import { IService, service } from './service';
import { ICollaborator, collaborator } from './collaborator';

let User = model<IUser>('User', user)
let Page = model<IPage>('Page', page)
let Image = model<IImage>('Image', image)
let Story = model<IStory>('Story', story)
let Service = model<IService>('Service', service)
let Collaborator = model<ICollaborator>('Collaborator', collaborator)

export {
    Page,
    Image,
    User,
    IUser,
    Story,
    IStory,
    Service,
    IService,
    Collaborator,
    ICollaborator
}