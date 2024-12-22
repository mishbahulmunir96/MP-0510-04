import { prisma } from "../../lib/prisma"


export const getEventService = async (id:number) => {
    try {
        const event = await prisma.event.findFirst({
            where:{id},
            include:{user:{select:{firstName:true}}}
        })

        if (!event) {
            throw new Error('invalid event id')
        }
        return event
    } catch (error) {
       throw error 
    }
}