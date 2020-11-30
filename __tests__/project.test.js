let Main = require('../main');

let p;

beforeEach(() => {
   p = new Main();
})

test('Tarefa não cadastrada, projeto com limite de tempo excedido.', async () => {
    let projectId = await p.createProject('Gestão de Tarefas');
    await p.createTask('primeira', 200, 'primeira tarefa', 0, projectId);
    await p.createTask('segunda', 200, 'segunda tarefa', 0, projectId);
    await p.createTask('terceira', 200, 'terceira tarefa', 0, projectId);
    await p.createTask('quarta', 201, 'quarta tarefa', 0, projectId);
    expect(await p.createTask('quinta', 200, 'quinta tarefa', 0, projectId)).toBe('falha');
    await p.resetDB()
})

test('Tarefa Prioritaria', async () => {
    let projectId = await p.createProject('Gestão de Tarefas');
    let tasksIds = [];
    tasksIds.push(await p.createTask('primeira', 400, 'primeira tarefa', 0, projectId));
    tasksIds.push(await p.createTask('segunda', 200, 'segunda tarefa', 1, projectId));
    tasksIds.push(await p.createTask('terceira', 100, 'terceira tarefa', 0, projectId));
    tasksIds.push(await p.createTask('quarta', 50, 'quarta tarefa', 0, projectId));

    expect(await p.priorityTask(projectId)).toBe('primeira')

    await p.taskCompleteAll(tasksIds);

    expect(await p.priorityTask(projectId)).toBe('Nenhuma tarefa prioritaria foi encontrada.')
    await p.resetDB()
})

test('Prioridade do Projeto', async () => {
    let projectId = await p.createProject('Gestão de Tarefas');
    await p.createTask('primeira', 400, 'primeira tarefa', 1, projectId);
    await p.createTask('segunda', 200, 'segunda tarefa', 0, projectId);
    
    let projectId2 = await p.createProject('Compressor') 
    await p.createTask('terceira', 100, 'terceira tarefa', 0, projectId2);
    await p.createTask('quarta', 50, 'quarta tarefa', 0, projectId2);

    expect(await p.priorityProject(projectId)).toBe(150)
    expect(await p.priorityProject(projectId2)).toBe(100)

    await p.resetDB()
})


test('Projeto incompleto não pode ser desabilitado.', async () => {
    let projectId = await p.createProject('Gestão de Tarefas');
    await p.createTask('primeira', 400, 'primeira tarefa', 1, projectId);
    await p.createTask('segunda', 200, 'segunda tarefa', 1, projectId);
    
    let projectId2 = await p.createProject('Compressor') 
    await p.createTask('terceira', 100, 'terceira tarefa', 0, projectId2);
    await p.createTask('quarta', 50, 'quarta tarefa', 0, projectId2);

    expect(await p.disableProject(projectId)).toBe('Sucesso')
    expect(await p.disableProject(projectId2)).toBe('Falha')

    await p.resetDB()
})