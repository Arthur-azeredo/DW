var tasks = [];

function showMenu() {
    console.log("\nMenu:");
    console.log("1. Adicionar Tarefa");
    console.log("2. Remover Tarefa");
    console.log("3. Listar Tarefas");
    console.log("4. Sair");
    var choice = prompt("Escolha uma opção: ");
    return Number(choice);
}

function addTask() {
    var newTask = prompt("Digite a nova tarefa: ");
    if (newTask) {
        tasks.push(newTask);
        console.log(`Tarefa "${newTask}" adicionada.`);
    } else {
        console.log("Nenhuma tarefa adicionada.");
    }
}

function removeTask() {
    if (tasks.length === 0) {
        console.log("Nenhuma tarefa para remover.");
        return;
    }
    var taskNumber = prompt("Digite o número da tarefa que deseja remover (1, 2, 3...): ");
    var index = Number(taskNumber) - 1;
    if (index >= 0 && index < tasks.length) {
        var removedTask = tasks.splice(index, 1);
        console.log(`Tarefa "${removedTask}" removida.`);
    } else {
        console.log("Número de tarefa inválido.");
    }
}

function listTasks() {
    if (tasks.length === 0) {
        console.log("Nenhuma tarefa cadastrada.");
    } else {
        console.log("\nTarefas:");
        tasks.forEach(function(task, index) {
            console.log(`${index + 1}. ${task}`);
        });
    }
}

function manageTasks() {
    var exit = false;
    while (!exit) {
        var choice = showMenu();
        switch (choice) {
            case 1:
                addTask();
                break;
            case 2:
                removeTask();
                break;
            case 3:
                listTasks();
                break;
            case 4:
                exit = true;
                console.log("Saindo do programa...");
                break;
            default:
                console.log("Opção inválida. Tente novamente.");
        }
    }
}

manageTasks();
