//Classe para a tabela projeto
class projetoRepository{
    constructor(dao){
        this.dao = dao;
    }

    createTable() {
        const sql = `
        CREATE TABLE IF NOT EXISTS projects (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          duration INTEGER,
          status INTEGER)`
        return this.dao.run(sql);
    }

    create(name, duration, status) {
        let id = this.dao.run('INSERT INTO projects (name, duration, status) VALUES (?, ?, ?)',[name, duration, status]);
        return id
    }

    update(project) {
        const { id, name, duration, status } = project
        return this.dao.run(
          `UPDATE projects SET name = ?, duration = ?, status = ? WHERE id = ?`,
        [name, duration, status, id])
    }

    delete(id) {
        return this.dao.run(
          `DELETE FROM projects WHERE id = ?`,
        [id])
    }

    dropTable() {
      const sql = `
        DROP TABLE projects`
      return this.dao.run(sql)
    }

    getById(id) {
      return this.dao.get(
          `SELECT * FROM projects WHERE id = ?`,
        [id])
    }

    getAll() {
        return this.dao.all(`SELECT * FROM projects`)
    }

    getTasks(projectId) {
        return this.dao.all(
          `SELECT * FROM tasks WHERE projectId = ?`,
        [projectId])
    }
}

module.exports = projetoRepository;