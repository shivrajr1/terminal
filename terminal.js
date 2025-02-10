


class TreeNode{
    constructor(name,url){
        this.name=name;
        this.url=url;
        this.parent=null;
        this.child=[];
    }
}
class Tree{
    constructor(){
        this.root=null;
        this.pwd=null;
    }
    createTree(node,parent=null){
        this.root=this.createRecursiveTree(node,parent);
        this.pwd=this.root;
    }
    createRecursiveTree(node,parent){
        let newNode=new TreeNode(node.name,node.url);
        newNode.parent=parent;
        for( let i=0;i<node.child.length;i++){
            newNode.child.push(this.createRecursiveTree(node.child[i],newNode));
        }
        return newNode;
    }
}
class Command{
    constructor(name,message=''){
        this.name=name;
        this.message=message;
    }
    getname(){
        return this.name;
    }
    commandError(){
        let terminal=document.getElementById("root");
        let div=document.createElement("div");
        div.innerHTML=this.message;
        terminal.appendChild(div);
    }
}
class Ls extends Command{
    constructor(){
        super('ls','not found internal or external command');
    }
    execute(file,array){
        if(array.length!=1){
            this.commandError();
            return;
        }
        let terminal=document.getElementById("root");
            
        if(file.pwd.child.length===0){
            let div=document.createElement("div");
            div.innerHTML='this folder has no folder';
            terminal.appendChild(div);
            return;
        }
        for(let i=0;i<file.pwd.child.length;i++){
            let div=document.createElement("div");
            div.innerHTML=file.pwd.child[i].name;
            terminal.appendChild(div);
        }
        
    }
    
}
class Help extends Command{
    constructor(){
        super("help","not found internal or external command")
    }
    execute(file,array){
        if(array.length!=1){
            this.commandError();
        }else{
            displaybox();
        }
        
    }
}
class Pwd extends Command{
    constructor(){
        super("pwd","not found internal or external command")
    }
    execute(file,array){
        if(array.length!=1){
            this.commandError();
            return;
        }
        let terminal=document.getElementById("root");
        let div=document.createElement("div");
        div.innerHTML=`your current directory is ${file.pwd.name}`;
        terminal.appendChild(div);
        
    }
}
class Open extends Command{
    constructor(){
        super("open","does not exist this file");
    }
    execute(file,array){
        if(array.length!==2){
            this.commandError();
            return;
        }
        
        let terminal=document.getElementById("root");
        let div=document.createElement("div");
        div.innerHTML=`no such file exist in this folder`;
        if(file.pwd.child.length===0){
        terminal.appendChild(div);
        return;
        }
        for(let i=0;i<file.pwd.child.length;i++){
            if(file.pwd.child[i].name===array[1]){
                window.open(file.pwd.child[i].url);
                return;
            }
        }
        terminal.appendChild(div);
    }
}
class Cd extends Command{
    constructor(){
        super("cd",'cd is not working for this command');
    }
    execute(file,array){
        if(array.length!==2){
            this.commandError();
            return;
        }
        let temp=file.pwd;
        if(array[1]==='..'){
            if(temp.parent!==null){
                temp=temp.parent;
                file.pwd=temp;
                dir_path=dir_path.slice(0,dir_path.lastIndexOf('\\'));
            }
            return;
        }
        let split_dir=array[1].split('/');
        for(let i=0;i<split_dir.length;i++){
            while(temp.child.length!==0){
                for(let j=0;j<temp.child.length;j++){
                    if(split_dir[i]===temp.child[j].name){
                        i++;
                        temp=temp.child[j];
                        file.pwd=temp;
                        if(split_dir.length===i){
                            // if reach final path
                            this.updatepath(split_dir);
                            return;
                        }
                        // if found middle in loop
                        j=temp.child.length;
                    }
                    if(j===temp.child.length-1){
                        // if not found in children
                        this.commandError();
                        return;
                    }
                }
            }
            // if children length 0
            this.commandError();
            return;
        }
    }
    updatepath(path_array){
        for(let i=0;i<path_array.length;i++){
            dir_path+="\\"+path_array[i];
            
        }
    }

}
class Exit extends Command{
    constructor(){
        super('exit','exit is not defined');
    }
    execute(file,array){
        if(array.length!==1){
            this.commandError();
            return;
        }
        window.close();
    }
}
class Terminal{
    constructor(){
        this.user='';
        this.file=new Tree();
        this.command=new Map();
    }
    displaybox(){
        let terminal=document.getElementById('root');
        let div=document.createElement('div');
        div.className='span_input';

        let span=document.createElement('span');
        span.className='span';
        span.innerHTML=dir_path+">";
        let input=document.createElement('input');
        input.className='inpt';
        input.type='text'
        
        div.appendChild(span);
        div.appendChild(input);
        terminal.appendChild(div);
        terminal.addEventListener('click',()=>{input.focus()});
        input.focus();
        
        input.addEventListener("keyup",(e)=>{
            if(e.code=='Enter'){
                this.replaceBox(input.value,div);
                // input.disabled =true;
                if(input.value.trim()!==''){
                    this.executeCommand(input.value);
                }
                this.displaybox();
            }
        })
    }
    replaceBox(input,oldDiv){
        let terminal=document.getElementById('root');
        let divhistory=document.createElement('div');
        divhistory.className='divhistory';

        let spanhistory=document.createElement('span');
        spanhistory.className='spanhistory';
        spanhistory.innerHTML=dir_path+">";

        let inputhistory=document.createElement('span');
        inputhistory.className='inputhistory';
        inputhistory.innerHTML=input;

        divhistory.appendChild(spanhistory);
        divhistory.appendChild(inputhistory);
        terminal.replaceChild(divhistory,oldDiv);
    }
    executeCommand(input){
        let array=input.trim().split(' ');
        // special for cd..
        if(array[0]==='cd..'){
            let temp=this.file.pwd;
            if(temp.parent!==null){
                temp=temp.parent;
                this.file.pwd=temp;
                dir_path=dir_path.slice(0,dir_path.lastIndexOf('\\'));
            }
            return;
        }
        if(!this.isValid(array[0])){
            this.errordisplay(input);
            return;
        }
        this.command.get(array[0]).execute(this.file,array);
    }
    errordisplay(message){
        let terminal=document.getElementById('root');
        let div=document.createElement('div');
        div.className='error_command'
        div.innerHTML=`'${message}' is not recognized as an internal or external command , operable program or batch file.`
        terminal.appendChild(div);               
    }
    isValid(command){
        return this.command.has(command);
    }
    createTree(filesystem){
        this.user=filesystem.user;
        this.file.createTree(filesystem.data);
    }
    addCommand(command){
        this.command.set(command.getname(),command);
    }
}

let t=new Terminal();

function displaybox(){
    let terminal=document.getElementById('root');
    let div=document.createElement('div');
    div.className='suggestion_box'

    let help=document.createElement('div');
    help.innerHTML='help &nbsp;&nbsp;:&nbsp; help show all basic commands'
    let ls=document.createElement('div');
    ls.innerHTML="ls &nbsp&nbsp;&nbsp;&nbsp;:&nbsp; ls show all folders"
    let cd=document.createElement('div');
    cd.innerHTML='cd &nbsp;&nbsp;&nbsp;&nbsp;:&nbsp; cd help to move subfolder and parent'
    let open=document.createElement('div');
    open.innerHTML='open &nbsp;&nbsp;:&nbsp; open use for visite website'
    let exit=document.createElement('div');
    exit.innerHTML='exite &nbsp;:&nbsp; exite for close terminal'

    div.appendChild(help);
    div.appendChild(ls);
    div.appendChild(cd);
    div.appendChild(open);
    div.appendChild(exit)

    terminal.appendChild(div);
}
displaybox()
let dir_path='user:\\root'

fetch("userfile.json")
.then(res=>{return res.json()})
.then(jsonfile=>{
    t.createTree(jsonfile);
   
}).catch(e=>{console.log(e)})


t.displaybox()
t.addCommand(new Ls());
t.addCommand(new Help());
t.addCommand(new Pwd());
t.addCommand(new Open());
t.addCommand(new Cd());
t.addCommand(new Exit());