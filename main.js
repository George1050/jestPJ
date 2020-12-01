const AppDAO = require('./dao')
const ProjectRepository = require('./src/Service/projeto_repository')
const TaskRepository = require('./src/Service/tarefa_repository')

const dao = new AppDAO('./src/database/database.sqlite3')
const projectRepo = new ProjectRepository(dao)
const taskRepo = new TaskRepository(dao)

class Main {
  constructor(){
    
  }

  //Primeiro teste
  async createProject(name, duration = 0, status = 0){
    try {
      await projectRepo.createTable();
      let { id } = await projectRepo.create(name, duration, status);
      return id;
    } catch (err) {
      console.log(err)
    }
  }

  async createTask(name, duration, description, isComplete, projectId){
    try {
      let project = await projectRepo.getById(projectId);
      if(project.duration > 800 || project === null){
        return 'falha';
      }

      await taskRepo.createTable();
      let result = await taskRepo.create(name, duration, description, isComplete, projectId);

      if(isComplete === 0){
        project.duration += duration; 
        await projectRepo.update(project);
      }
      return result.id
    } catch (err) {
      console.log(err)
    }
    
  }

  //Segundo teste e Terceiro Teste
  async priorityTask(id){
    let tasks = await taskRepo.getAll(id);
    let aux = {'duration' : null}
    tasks.forEach(element => {
      if(aux.duration === null && element.isComplete === 0){
        aux = element;
      }else if(aux.duration < element.duration && element.isComplete === 0){
        aux = element;
      }
    })
    if(aux.duration === null){
      return "Nenhuma tarefa prioritaria foi encontrada."
    }
    return aux.name;
  }

  //Quarto Teste
  async priorityProject(id){
    try {
      let tasks = await taskRepo.getAll(id);
      let project = await projectRepo.getById(id)
      let complete = 0;
      for(let i = 0; i<tasks.length; i++){
        if(tasks[i].isComplete === 1){
          complete++;
        }

      }

      let calc = project.duration*4;
      calc += (complete/tasks.length*100)*2;
      return parseInt(calc/6)
    } catch (error) {
      console.log(error)
    }
  }

  //Quinto Teste
  async taskCompleteAll(tasksIds){
    try {
      for(let i = 0; i < tasksIds.length; i++){
          let task = await taskRepo.getById(tasksIds[i])
          task.isComplete = 1;
          await taskRepo.update(task)
      }
    } catch (error) {
      console.log(error)
    }
  }

  async disableProject(id){
    let project = await projectRepo.getById(id);
    if(project.duration === 0){
      project.status = 1;
      await projectRepo.update(project)
      return 'Sucesso'
    }else{
      return 'Falha'
    }
  }

  async resetDB(){
    await projectRepo.dropTable()
    await taskRepo.dropTable()
  }
}


module.exports = Main