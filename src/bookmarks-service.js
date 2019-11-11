const BookmarksService = {
    getAllBookmarks(knex) {
        return knex.select('*').from('BookmarksService')    
    },
    insertBookmark(knex, newBookmark) {
        return knex
            .insert(newBookmark)
            .into('bookmarks_drill')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
        return knex.from('bookmarks_drill').select('*').where('id', id).first()
    },
    deleteBookmark(knex, id) {
        return knex('bookmarks_drill')
            .where({id})
            .delete()
    },
    updateBookmark(knex, id, newBookmarkFields) {
        return knex('bookmarks_drill')
            .where({id})
            .update(newBookmarkFields)
    },
}

module.exports = ArticlesService;