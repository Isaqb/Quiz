let current_quiz = null
let current_question = null
let data_Inicio = null
let data_fim = null
class Quiz {
    constructor(nome,data_Inicio,data_fim,status,id){
        this.nome= nome
        this.data_Inicio= data_Inicio
        this.data_fim= data_fim
        this.status= status
        this.id = "q"+id.toString()
    }

    validarDadosQuiz(){
        for(let i in this){
            if(this[i] == undefined ||this[i] == '' ||this[i] == null ){
                return false
            }
        }
        return true
    }
}

class Perguntas {
    constructor(id_quiz,pergunta,id){
        this.id_quiz = id_quiz
        this.pergunta = pergunta
        this.id= "p" + id.toString()
    }

    validarDadosPerguntas(){
        for(let i in this){
            if(this[i] == undefined ||this[i] == '' ||this[i] == null ){
                return false
            }
        }
        return true
    }
}
class Respostas {
    constructor(quizId,pergId,id,resp,certa){
        this.quizId = quizId
        this.pergId = pergId
        this.id = 'r' + id.toString()
        this.resp = resp
        this.certa = certa
    }
    validarDadosRespostas(){
        for(let i in this){
            if(this[i] == undefined ||this[i] == '' ||this[i] == null ){
                return false
            }
        }
        return true
    }
}

class Armazenar{
    constructor(){
        let id = localStorage.getItem('id_quiz')
        if(id === null){
            localStorage.setItem('id_quiz', 0)
        }
    }

    getProximoId(){
        let proximoId = localStorage.getItem('id_quiz')
        return parseInt(proximoId) + 1
    }
    

    gravar(d){
        let id = this.getProximoId()
        localStorage.setItem('q'+id.toString(),JSON.stringify(d))
        localStorage.setItem('id_quiz', id)
    }

    recuperarTodosRegistros(){
        let quiz = Array()
        let id = localStorage.getItem('id_quiz')
        for(let i = 1; i<=id; i++){
            let q = JSON.parse(localStorage.getItem('q'+i.toString()))
            if(q != null){
                q.id = i
               quiz.push(q) 
            }
        }
        return quiz
    }

    edita(id,q){
        localStorage.setItem(id,JSON.stringify(q))
    }

    remover(id){
        localStorage.removeItem('q'+id.toString())
    }
}
let armazenar = new Armazenar();

class Armazenar_Pergunta{
    constructor(){
        let id = localStorage.getItem('id_pergunta')
        if(id === null){
            localStorage.setItem('id_pergunta', 0)
        }
    }

    getProximoId(){
        let proximoId = localStorage.getItem('id_pergunta')
        return parseInt(proximoId) + 1
    }

    gravar(d){
        let id = this.getProximoId()
        localStorage.setItem('p'+id,JSON.stringify(d))
        localStorage.setItem('id_pergunta', id)
    }

    recuperarTodosRegistros(){
        let quiz = Array()
        let id = localStorage.getItem('id_pergunta')
        for(let i = 1; i<=id; i++){
            let q = JSON.parse(localStorage.getItem('p'+i.toString()))
            if(q != null){
                q.id = i
               quiz.push(q) 
            }
        }
        return quiz
    }

    edita(id,p){
        localStorage.setItem(id,JSON.stringify(p))
    }

    remover(id){
        localStorage.removeItem('p'+id.toString())
    }
}
let armazenar_p = new Armazenar_Pergunta();

class Armazenar_Resposta{
    constructor(){
        let id = localStorage.getItem('id_r')
        if(id === null){
            localStorage.setItem('id_r', 0)
        }
    }

    getProximoId(){
        let proximoId = localStorage.getItem('id_r')
        return parseInt(proximoId) + 1
    }

    gravar(d){
        let id = this.getProximoId()
        localStorage.setItem('r'+id,JSON.stringify(d))
        localStorage.setItem('id_r', id)
    }

    recuperarTodosRegistros(){
        let quiz = Array()
        let id = localStorage.getItem('id_r')
        for(let i = 1; i<=id; i++){
            let q = JSON.parse(localStorage.getItem('r'+i.toString()))
            if(q != null){
                q.id = i
               quiz.push(q) 
            }
        }
        return quiz
    }

    remover(id){
        localStorage.removeItem('r'+id.toString())
    }
}
let armazenar_r = new Armazenar_Resposta();

function perg_resp_Quiz_Apagado(quiz_Id){
    let pergunta = Array();
    let resposta = Array();
    pergunta = armazenar_p.recuperarTodosRegistros();
    resposta = armazenar_r.recuperarTodosRegistros();

    pergunta.forEach(p => {
        if(p.id_quiz == quiz_Id){
            armazenar_p.remover(p.id)

            window.location.reload()
        }
    });

    resposta.forEach(r =>{
        if(r.quizId == quiz_Id){
            armazenar_r.remover(r.id)

            window.location.reload()
        }
    });
}

function resp_Pergunta_Apagada(pergunta_Id){
    let resposta = Array();
    resposta = armazenar_r.recuperarTodosRegistros();
    resposta.forEach(r =>{
        if(r.pergId == pergunta_Id){
            armazenar_r.remover(r.id)
            window.location.reload()
        }
    });
}

function carregarQuiz(quiz = Array()){
    if(quiz.length == 0 ){
        quiz = armazenar.recuperarTodosRegistros()
     }

    let tabela = document.getElementById('tabelaQuiz') 
    tabela.innerHTML =''
    if(quiz.length == 0){
            tabela.innerHTML ='Nenhum quiz cadastrado'
        }
    quiz.forEach(function(q){
        let linha = tabela.insertRow()
        //colunas: Código->0Nome do Quiz->1Quantidade de perguntas->2Ações->3
        linha.insertCell(0).innerHTML = q.id
        linha.insertCell(1).innerHTML = q.nome
        let qtdPerguntas = contarPerguntas('q'+q.id.toString())
        linha.insertCell(2).innerHTML = qtdPerguntas;

       let btn = document.createElement('button')
       btn.className = 'btn btn-danger'
       btn.innerHTML = '<i class="fas fa-times"></i>'
       btn.id = `id_quiz_${q.id}`
       btn.onclick = function(){
           let id = this.id.replace('id_quiz_', '')
           perg_resp_Quiz_Apagado('q'+q.id.toString())
           armazenar.remover(id)
           //remover perguntas e respostas associadas
           //window.location.reload()
       }
       btn_edit = document.createElement('button')
       btn_edit.className = 'btn btn-primary'
       btn_edit.innerHTML = '<i class="far fa-edit"></i>'
       btn_edit.onclick = function(){
            current_quiz = 'q'+q.id.toString()
            $(`#modal-editar`).modal('show')
            carregarPergunta('editar')
            let btn_salvar =  document.getElementById('btn_salvar');
            btn_salvar.onclick = function(){
                let nome = document.getElementById('nome_quiz_0');
                let status = 'Editado';
                let quiz_ed = new Quiz(nome.value,data_Inicio,data_fim,status,q.id);
                if(quiz_ed.validarDadosQuiz()){
                    armazenar.edita('q'+q.id.toString(),quiz_ed);
                }else{
                    alert("Preencha todos os dados do quiz!!")
                }
                carregarQuiz()
                carregarPergunta('editar')
            }
            
       }
       linha.insertCell(3).append(btn)
       linha.insertCell(3).append(btn_edit)

    });
}

function carregarPergunta(flag = 'normal'){
    let retorno = Array();
    let pergunta = Array();
    if(retorno.length == 0){
        retorno = armazenar_p.recuperarTodosRegistros()
        retorno.forEach(element => {
            if(element.id_quiz == current_quiz){
                pergunta.push(element)
            }
        });
     }
    let tabela = null
    if (flag=="normal"){
        tabela = document.getElementById('tabelaPergunta')
    }
    if(flag=="editar"){
        tabela = document.getElementById('tabelaPerguntaEditar')
    }
    
    tabela.innerHTML =''

    pergunta.forEach(function(p){
        let linha = tabela.insertRow()
        //colunas: Código->0Nome do Quiz->1Quantidade de perguntas->2Ações->3
        linha.insertCell(0).innerHTML = p.id
        linha.insertCell(1).innerHTML = p.pergunta
        let qtsResp = contarRespostas('p' + p.id.toString())
        linha.insertCell(2).innerHTML = qtsResp
        let btn = document.createElement('button')
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_pergunta_${p.id}`
        btn.onclick = function(){
            let id = this.id.replace('id_pergunta_', '')
            armazenar_p.remover(id)
            resp_Pergunta_Apagada('p'+p.id.toString())
            window.location.reload()
        }
        btn_edit = document.createElement('button')
        btn_edit.className = 'btn btn-primary'
        btn_edit.innerHTML = '<i class="far fa-edit"></i>'
        btn_edit.onclick = function(){
            current_question = 'p'+p.id.toString()
            $(`#modal-editar-pergunta`).modal('show')
            carregarResposta('editar');
            let btn_salvar =  document.getElementById('btn_salvar_pergunta');
            btn_salvar.onclick = function(){
                let pgt = document.getElementById('pergunta_editada');
                let id_quiz = p.id_quiz;
                let pergunta_ed = new Perguntas(id_quiz,pgt.value,p.id);
                if(pergunta_ed.validarDadosPerguntas()){
                   armazenar_p.edita(('p'+p.id.toString()),pergunta_ed); 
                }else{
                    alert('Preencha todos os dados da pergunta!')
                }

                if (flag=="normal"){
                    carregarPergunta()
                }
                if(flag=="editar"){
                    carregarPergunta('editar')
                }
                
                
        }
        
        }
        linha.insertCell(3).append(btn)
        linha.insertCell(3).append(btn_edit)
});
    $(`modal-quiz`).modal('show')
}

function carregarResposta(flag = 'normal'){
    let retorno = Array()
    let resposta = Array()
    if(resposta.length == 0){
        retorno = armazenar_r.recuperarTodosRegistros()
        retorno.forEach(function(r){
            if(r.pergId == current_question){
                resposta.push(r)
            }
        })
    }
    
    let tabela = null
    if (flag=="normal"){
        tabela = document.getElementById('tabelaResposta')
    }
    if(flag=="editar"){
        tabela = document.getElementById('tabelaRespostaEditar')
    }
    
    tabela.innerHTML =''

    resposta.forEach(function(r){
        let linha = tabela.insertRow()
        //colunas:Nome da Resposta->0Correta->1Ações->2
        linha.insertCell(0).innerHTML = r.resp
        linha.insertCell(1).innerHTML = r.certa
        let btn = document.createElement('button')
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_r_${r.id}`
        btn.onclick = function(r){
            let id = this.id.replace('id_r_', '')
            armazenar_r.remover(id)

            window.location.reload()
        }
        linha.insertCell(2).append(btn)
        });
        $(`modal-respostas`).modal('show')
}

function registro_data(start, end){
    data_Inicio = start
    data_fim = end
}

function cadastrarQuiz(){
    let nome = document.getElementById('nome_quiz');
    let status = 'Publicado';
    let quiz = new Quiz(nome.value,data_Inicio,data_fim,status,armazenar.getProximoId());

    if(quiz.validarDadosQuiz()){
        armazenar.gravar(quiz);
        current_quiz = quiz.id;
        carregarQuiz();
        document.getElementById("btn_add_modal_pergunta").disabled = false;
    }else{
        alert('Preencha todos os campos!!')
        $("#modal-quiz").modal('show')
    }
    
}

function adicionarPergunta(){
    //modal de perguntas
    let p = document.getElementById('pergunta');
    let id_quiz = current_quiz;

    let pergunta = new Perguntas(id_quiz,p.value,armazenar_p.getProximoId());
    if(pergunta.validarDadosPerguntas()){
        current_question = pergunta.id;
        armazenar_p.gravar(pergunta);
        carregarPergunta();
        carregarResposta();
        document.getElementById("btn_add_resposta").disabled = false;
    }else{
        $("#modal-respostas").modal('show')
        alert("Preencha todos os campos!!")
    }
    
}

function adicionarResposta(){
    //modal de respostas
    let r = document.getElementById('resposta');
    let id_quiz = current_quiz;
    let id_pergunta = current_question;
    //let v = $('input[name="flexRadioDefault"]:checked');
    //console.log('checkcbox='+v.v)
    let v = true;
    $('input[name="flexRadioDefault"]:checked').each(function() {
        v = this.value
     });
    let resposta = new Respostas(id_quiz,id_pergunta,armazenar_r.getProximoId(),r.value,v);
    if(resposta.validarDadosRespostas()){
        armazenar_r.gravar(resposta);
        $(`modal-respostas`).modal('show')
        carregarResposta();
    }else{
        $("#modal-respostas").modal('show')
        alert("Preencha todos os campos!!")  
    }
    
}

function contarPerguntas(id_quiz){
    let filtro = Array();
    filtro = armazenar_p.recuperarTodosRegistros();
    let cont = 0;
    filtro.forEach(function(f){
        if(f.id_quiz == id_quiz){
            cont = cont + 1
        }
    });
    return cont;
}

function contarRespostas(id_resp){
    let filtro = Array();
    filtro = armazenar_r.recuperarTodosRegistros();
    let cont = 0;
    filtro.forEach(function(f){
        if(f.pergId == id_resp){
            cont = cont + 1
        }
    });
    return cont;
}
