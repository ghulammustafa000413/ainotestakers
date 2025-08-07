import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const AddFileEntryDb= mutation({
    args:{
        fileId:v.string(),
        storageId:v.optional(v.string()),
        fileName:v.string(),                                                              
        createdBy:v.string(),
        fileUrl:v.string(),
    },
    handler: async (ctx,args) =>{
        const result = await ctx.db.insert('pdfFiles',{ 
            fileId:args.fileId,
            storageId:args.storageId,
            fileName:args.fileName,
            createdBy:args.createdBy,
            fileUrl:args.fileUrl,

        })

        return "Inserted"
    }
})

export const getFileUrl = mutation({
  args: {
    storageId: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    if (!args.storageId) {
      return null; // or handle as you wish
    }
    const url = await ctx.storage.getUrl(args.storageId);
    
    return url;
  }
});

export const GetFileRecord = query({
  args:{
    fileId:v.string()
  },
  handler: async (ctx, args) =>{
    const result =await ctx.db.query('pdfFiles').filter((q)=>q.eq(q.field('fileId'), args.fileId)).collect()
    // console.log(result)
    return result ;
  }
})

export const GetUserFiles = query({
  args:{
    userEmail:v.optional(v.string()),
  },
  handler: async (ctx,args) => {

    if(!args?.userEmail){
      return ;
    }
    const result = await ctx.db.query('pdfFiles')
      .filter((q) => q.eq(q.field('createdBy'), args.userEmail)).collect();


      return result;
    
  }

})

