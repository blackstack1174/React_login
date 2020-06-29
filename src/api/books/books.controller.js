const Book = require('models/book');



exports.replace = async (ctx) => {
    let book;

    const { id } = ctx.params;

    try {
        book = await Book.findByIdAndUpdate(id, ctx.request.body, {
            upsert: true,
            new: true
        });
    }catch(e) {
        return ctx.throw(500, e);
    }
    ctx.body = book;
};

exports.list = async (ctx) => {
    let books;

    try{
        books = await Book.find()
            .sort({ _id: -1 })
            .limit(3)
            .exec();
    }catch(e) {
        return ctx.throw(500, e);
    }

    if(!books) {
        ctx.status = 404;
        ctx.body = { message: 'book not find' };
        return;
    }

    ctx.body = books;
};


exports.get = async (ctx) => {
    const { id } = ctx.params;

    let books;

    try{
        books = await Book.findById(id).exec();
    }catch(e) {
        return ctx.throw(500, e);
    }

    if(!books) {
        ctx.status = 404;
        ctx.body = { message: 'book not find' };
        return;
    }
    
    ctx.body = books;
};

exports.create = async (ctx) => {
    // request body 에서 값들을 추출합니다
    const { 
        title, 
        authors, 
        publishedDate, 
        price, 
        tags 
    } = ctx.request.body;

    // Book 인스턴스를 생성합니다
    const book = new Book({
        title, 
        authors,
        publishedDate,
        price,
        tags
    });

    try {
        await book.save();
    } catch(e) {
        // HTTP 상태 500 와 Internal Error 라는 메시지를 반환하고, 
        // 에러를 기록합니다.
        return ctx.throw(500, e);
    }

    // 저장한 결과를 반환합니다.
    ctx.body = book;
};


exports.delete = async (ctx) => {
    const { id } = ctx.params;

    try {
        await Book.findByIdAndRemove(id).exec();
    }catch(e) {
        if(e.name === 'CastError') {
            ctx.status = 400;
            return;
        }
    }

    ctx.body = '[' + id + '] 삭제가  처리 되었습니다.';
};
