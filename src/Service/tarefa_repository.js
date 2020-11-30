class tarefaRepository{
    constructor(dao){
        this.dao = dao
    }

    createTable() {
      const sql = `
        CREATE TABLE IF NOT EXISTS tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          duration INTEGER,
          description TEXT,
          isComplete INTEGER DEFAULT 0,
          projectId INTEGER,
          CONSTRAINT tasks_fk_projectId FOREIGN KEY (projectId)
            REFERENCES projects(id) ON UPDATE CASCADE ON DELETE CASCADE)`
      return this.dao.run(sql)
    }

    create(name, duration, description, isComplete, projectId) {
        return this.dao.run(
          `INSERT INTO tasks (name, duration, description, isComplete, projectId)
            VALUES (?, ?, ?, ?, ?)`,
        [name, duration, description, isComplete, projectId])
    }

    update(task) {
        const { id, name, duration, description, isComplete, projectId } = task
        return this.dao.run(
          `UPDATE tasks
          SET name = ?,
            description = ?,
            duration = ?,
            isComplete = ?,
            projectId = ?
          WHERE id = ?`,
        [name, duration, description, isComplete, projectId, id])
    }

    delete(id) {
        return this.dao.run(
          `DELETE FROM tasks WHERE id = ?`,
        [id])
    }

    dropTable() {
      const sql = `
        DROP TABLE tasks`
      return this.dao.run(sql)
    }

    getById(id) {
        return this.dao.get(
          `SELECT * FROM tasks WHERE id = ?`,
        [id])
    }

    getAll(id){
      return this.dao.all(`SELECT * FROM tasks WHERE projectId = ?`,[id])
    }
}

module.exports = tarefaRepository;