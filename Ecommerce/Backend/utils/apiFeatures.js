const { json } = require("express");

class ApiFeature{
    constructor(query,qureyStr){
        this.query=query;
        this.qureyStr=qureyStr;
    }

    search(){
        const keyword=this.qureyStr.keyword ?{
            name:{
                $regex:this.qureyStr.keyword,
                $options:"i"
            }
        }:{}
        
        this.query=this.query.find({...keyword})
        return this;
    }
    filter(){
        const queryCopy={...this.qureyStr}
       
        //removing some fields for catagory
        const removeFields=["keyword","page","limit"]

        removeFields.forEach(key=>delete queryCopy[key])

        //filtering for price nad rating
        let qureyStr=JSON.stringify(queryCopy)
        qureyStr=qureyStr.replace(/\b(gt|gte|lt|lte)\b/g,(key) =>`$${key}`)

        this.query=this.query.find(JSON.parse(qureyStr))
        
        return this;
   
    }
    //paging
    pagination(resultPerPage){
        const currentPage=Number(this.qureyStr.page)||1
        const skip=resultPerPage*(currentPage-1)
        this.query=this.query.limit(resultPerPage).skip(skip)
        return this;
    }
}

module.exports=ApiFeature;