function buildTree(data) {
    const nodes = {};
    const tree = [];

    // Create nodes and map them by ID for quick access
    data.forEach(item => {
        nodes[item.id] = {...item, children: []};
    });

    // Build the tree by establishing parent-child relationships
    data.forEach(item => {
        if (item.parent_id !== null) {
            nodes[item.parent_id].children.push(nodes[item.id]);
        } else {
            tree.push(nodes[item.id]);
        }
    });

    return tree;
}

function get_item_chat(item){
    let waktu = item.created_at ? moment.utc(item.created_at).fromNow() : '';

    return `
        <div class="card-body bg-light shadow p-3 m-0 mb-2 rounded-4">
            <div class="d-flex flex-wrap justify-content-between align-items-center">
                <p class="text-dark text-truncate m-0 p-0" style="font-size: 0.95rem;">
                    <strong class="me-1">${item.name}</strong>
                    ${item.depth == 1 ? item.is_hadir ? '<i class="fa-solid fa-circle-check text-success"></i>' : '<i class="fa-solid fa-circle-xmark text-danger"></i>' : ''}
                    <br><small>${item.email ? item.email : '-'}</small> 
                </p>
                <small class="text-dark m-0 p-0" style="font-size: 0.75rem;">${waktu}.</small>
            </div>
            <hr class="text-dark my-1">
            <p class="text-dark mt-0 mb-1 mx-0 p-0" style="white-space: pre-line">${item.text}</p>
            
            <!--
            <div class="d-flex flex-wrap justify-content-between align-items-center">
                <div class="d-flex flex-wrap justify-content-start align-items-center">
                    <button style="font-size: 0.8rem;" onclick="comment.balasan(this)" data-uuid="336d0b77-bba6-4fac-8736-21111d191583" class="btn btn-sm btn-outline-dark rounded-3 py-0">Balas</button>
                </div>
                <button style="font-size: 0.8rem;" onclick="like.like(this)" data-uuid="336d0b77-bba6-4fac-8736-21111d191583" class="btn btn-sm btn-outline-dark rounded-2 py-0 px-0">
                    <div class="d-flex justify-content-start align-items-center">
                        <p class="my-0 mx-1" data-suka="${item.likes ? item.likes : 0}">${item.likes ? item.likes : 0} suka</p>
                        ${item.likes ? '<i class="py-1 me-1 p-0 fa-heart fa-solid text-danger"></i>' : '<i class="py-1 me-1 p-0 fa-regular fa-heart"></i>'}
                    </div>
                </button>
            </div>
            -->
        </div>
        ${item.children ? get_children_data(item) : ''}
    `
}

function get_children_data(data){
    // console.log(data)
    conten = '<ul>'
    data.children.map(item => {
        conten += `
            <li>
                ${get_item_chat(item)}
            </li>
        `
    })
    conten += '</ul>'
    return conten
}

const { createClient } = supabase
const _supabase = createClient('https://hhdaiavaatkkgmbfmwqd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhoZGFpYXZhYXRra2dtYmZtd3FkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTIyMTQyNTAsImV4cCI6MjAyNzc5MDI1MH0.SJpqP2YmE4oBUjCTCOAb37eI21h2uSqSZE2UMmfHX-o')
// console.log('Supabase Instance: ', _supabase)

async function fetchData() {
    const { data, error } = await _supabase
        .rpc(`get_chat_tree`);

    if (error) {
        console.error('Error fetching data:', error);
        return;
    }

    // console.log('Fetched data:', data);
    // console.log('error :', error);

    const treeStructure = buildTree(data);
    // console.log(treeStructure);

    const contain_chat = $('#daftar-ucapan-new')
    conten_html = `<ul style="padding:0;">`
    treeStructure.map((item, index) => {
        conten_html += `
        <li class="chat-parent">
            ${get_item_chat(item)}
        </li>
        `
    })
    conten_html += '</ul>'
    contain_chat.html(conten_html)
}

// Call the fetchData function to retrieve data
fetchData();