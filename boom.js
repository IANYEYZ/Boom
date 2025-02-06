blocks = []
app = document.getElementById("app")
console.log(app)

editors = []
nodeWithEditor = []

var mdp = makeMDP();

renderBlock = (block, node, id_) => {
    if (block[0] == "html") {
        node.innerHTML += 
        /* html */`<div class="block">
            <div class="badge-container">
                <div class="badge" onclick = "del(${id_})">del</div>
                <div class="badge" onclick = "addNew(${id_}, 'html')">+html</div>
                <div class="badge" onclick = "addNew(${id_}, 'md')">+markdown</div>
                <div class="badge" onclick = "addNew(${id_}, 'code')">+code</div>
            </div>
            <div onclick="toTextArea(${id_})" id="block${id_}">
                ${block[1]}
            </div>
        </div>`
    } else if (block[0] == "md") {
        html = mdp.render(block[1])
        node.innerHTML += 
        /* html */`<div class="block">
            <div class="badge-container">
                <div class="badge" onclick = "del(${id_})">del</div>
                <div class="badge" onclick = "addNew(${id_}, 'html')">+html</div>
                <div class="badge" onclick = "addNew(${id_}, 'md')">+markdown</div>
                <div class="badge" onclick = "addNew(${id_}, 'code')">+code</div>
            </div>
            <div onclick="toTextArea(${id_})" id="block${id_}">
                ${html}
            </div>
        </div>`
    } else if (block[0] == "code") {
        console.log(id_)
        if (document.getElementById(`codeEditor${id_}`) in nodeWithEditor) {
            console.log("Returned!")
            return
        }
        node.innerHTML += 
        /* html */`
        <div class="block">
            <div class="badge-container">
                <div class="badge" onclick = "del(${id_})">del</div>
                <div class="badge" onclick = "addNew(${id_}, 'html')">+html</div>
                <div class="badge" onclick = "addNew(${id_}, 'md')">+markdown</div>
                <div class="badge" onclick = "addNew(${id_}, 'code')">+code</div>
            </div>
            <div>
                <div id="code${id_}" class="code-holder">
                    <textarea id="codeEditor${id_}" class="code-editor">${block[1]}</textarea>
                    <div class="code-result-holder">
                        <div class="badge" onclick="run(${id_})">run</div>
                        <div id="codeResult${id_}" class="code-result">${block[2]}</div>
                    </div>
                </div>
            </div>
        </div>`
        // editors.push(new Iblize(`#codeEditor${id_}`))
        // editors[editors.length - 1].setValue(block[1])
        // const initialState = cm6.createEditorState(block[1]);
        // editors.push(cm6.createEditorView(initialState, document.getElementById(`codeEditor${id_}`)));
        // nodeWithEditor.push(document.getElementById(`codeEditor${id_}`))
        document.getElementById(`codeEditor${id_}`).addEventListener('change', (event) => {
            blocks[id_][1] = event.target.value
        })
    }
}

renderAll = () => {
    app.innerHTML = ""
    editors = []
    nodeWithEditor = []
    if (blocks.length == 0) {
        app.innerHTML = /* html */`<div class="stw" onclick="init()">Start writing</div>`
        return
    }
    console.log(blocks)
    for (i in blocks) {
        renderBlock(blocks[i], app, i)
    }
}

del = (id) => {
    console.log(id)
    blocks.splice(id, 1)
    renderAll()
}

toTextArea = (id) => {
    console.log(id)
    if (blocks[id][0] == "html" || blocks[id][0] == "md") {
        document.getElementById(`block${id}`).innerHTML = /* html */`
        <textarea id="textarea${id}" class="text-area">${blocks[id][1]}</textarea>
        `
        txt = document.getElementById(`textarea${id}`)
        cnt = 0
        handle = (event) => {
            if (!txt.contains(event.target)) {
                cnt++
                if (cnt == 2) {
                    console.log("Click!")
                    if (blocks[id][0] == "html") {
                        document.getElementById(`block${id}`).innerHTML = txt.value
                    } else {
                        document.getElementById(`block${id}`).innerHTML = marked.parse(txt.value)
                    }
                    blocks[id] = [blocks[id][0], txt.value]
                    document.removeEventListener("click", handle)
                }
            }
        }
        document.addEventListener("click", handle)
        txt.addEventListener("click",(event) => {
            event.stopPropagation()
        })
    }
}

addNew = (id, typ) => {
    if (typ == 'code') {
        blocks.splice(id + 1, 0, [typ, "1 + 2 + 3 + 4 + 5", 15])
        renderAll()
        return
    }
    blocks.splice(id + 1, 0, [typ, "click to start editing"])
    renderAll()
}

init = () => {
    blocks.push(["html", "<p>Here you start</p>"])
    renderAll()
}

run = (id) => {
    console.log("run")
    blocks[id][2] = eval(blocks[id][1])
    // document.getElementById(`codeResult${id_}`).innerHTML = eval(blocks[id][1])
    renderAll()
}
blocks.push(["md", /* markdown */`# Boom.js`])
blocks.push(["md", "**Boom.js** is an interactive notebook that supports javascript, you can click on any elements to edit it(supports html and markdown, but only one per element), note that your prgress **won't be saved**"])
blocks.push(["md", "Here's a programme to add some numbers"])
blocks.push(["code", /* js */`1 + 2 + 3 + 4 + 5`, 15])
renderAll()