let add = document.querySelector("#add");
add.addEventListener('click', show_menu);

let menu = document.querySelector('#menu');

let user_title = document.getElementById('user_title');
let user_description = document.getElementById('user_description');



let edit_title = document.querySelector('#edit_title');
let error = document.querySelector('#error');



let save = document.querySelector('#save');
save.addEventListener('click', checkContent);
let cancle = document.querySelector('#cancle');
cancle.addEventListener('click', hide_menu);
cancle.addEventListener('click', hide_error);
cancle.addEventListener('click', clear_menu);


let seasonFilter = document.getElementById('season');
seasonFilter.addEventListener('change', filterDivs);

let view = document.querySelector('#view');

document.addEventListener('DOMContentLoaded', () => {
    const savedItems = JSON.parse(localStorage.getItem('notes')) || [];
    savedItems.forEach(item => {
        const notes = document.getElementById('notes');
        const newDiv = document.createElement('div');
        newDiv.classList.add('box');
        if (item.category) {
            newDiv.classList.add(item.category);
        }

        const title = document.createElement('p');
        title.classList.add('box-title');
        title.textContent = item.title;

        // 添加点击事件，显示详细信息
        newDiv.addEventListener('click', () => showView(item.title));

        const img = document.createElement('img');
        img.src = 'images/close.png';
        img.alt = 'Delete';
        img.title = 'Delete this item';

        img.addEventListener('click', (event) => {
            event.stopPropagation();
            newDiv.remove();
            removeFromStorage(item.title);
        });

        newDiv.appendChild(title);
        newDiv.appendChild(img);
        notes.appendChild(newDiv);
    });
});

function filterDivs() {
    const selectedSeason = seasonFilter.value; // 获取用户选择的值
    const divs = document.querySelectorAll('.box'); // 获取所有 .box 元素

    divs.forEach(div => {
        if (selectedSeason === 'all') {
            // 如果选择显示全部，则显示所有 div
            div.style.display = 'block';
        } else {
            // 判断 div 是否包含所选季节的类
            if (div.classList.contains(selectedSeason)) {
                div.style.display = 'block'; // 显示
            } else {
                div.style.display = 'none'; // 隐藏
            }
        }
    });
}


function checkContent() {
    if (edit_title.value === '' || user_description.value === '') {
        error.style.display = 'flex';
    } else {
        addDiv();
        hide_menu();
        clear_menu();
        hide_error();
    }
}


function addDiv() {
    const notes = document.getElementById('notes');
    const newDiv = document.createElement('div');
    newDiv.classList.add('box'); // 添加基础样式

    // 获取用户输入的值
    const titleValue = user_title.value;
    const descriptionValue = user_description.value;
    const category = document.getElementById('user_category').value;
    const createTime = new Date().toLocaleString();

    // 检查并添加类别类（如 spring, summer, autumn, winter）
    if (category) {
        newDiv.classList.add(category);
    }

    // 保存到 localStorage
    const savedItems = JSON.parse(localStorage.getItem('notes')) || [];
    savedItems.push({ title: titleValue, description: descriptionValue, category, createTime, lastAccessTime: '' });
    localStorage.setItem('notes', JSON.stringify(savedItems));

    // 创建标题元素
    const title = document.createElement('p');
    title.classList.add('box-title');
    title.textContent = titleValue;

    // 添加点击事件显示详细信息
    newDiv.addEventListener('click', () => showView(titleValue));

    // 创建右上角的图片
    const img = document.createElement('img');
    img.src = 'images/close.png';
    img.alt = 'Delete';
    img.title = 'Delete this item';

    // 为图片绑定点击事件，删除父级 div
    img.addEventListener('click', (event) => {
        event.stopPropagation(); // 防止触发父级 div 的点击事件
        newDiv.remove();
        removeFromStorage(titleValue);
    });

    // 将标题和图片添加到新创建的 div 中
    newDiv.appendChild(title);
    newDiv.appendChild(img);

    // 将新 div 添加到 notes 容器中
    notes.appendChild(newDiv);
}

function showView(title) {
    const savedItems = JSON.parse(localStorage.getItem('notes')) || [];
    const item = savedItems.find(item => item.title === title);

    if (item) {
        // 更新 view 内容
        document.getElementById('view_title').querySelector('h1').textContent = item.title;
        document.getElementById('view_season').textContent = `Category: ${item.category}`;
        document.getElementById('view_description').textContent = `Description: ${item.description}`;
        document.getElementById('creat_time').textContent = `Created Time: ${item.createTime}`;
        const accessTime = new Date().toLocaleString();
        document.getElementById('access_time').textContent = `Last Accessed: ${accessTime}`;

        // 更新最后访问时间
        item.lastAccessTime = accessTime;
        localStorage.setItem('notes', JSON.stringify(savedItems));
    }

    show_view(); // 显示遮罩层和 view
}


document.getElementById('close_view').addEventListener('click', () => {
    document.getElementById('view').style.display = 'none'; // 隐藏 view
});


// 删除项目从 localStorage
function removeFromStorage(title) {
    const savedItems = JSON.parse(localStorage.getItem('notes')) || [];
    const updatedItems = savedItems.filter(item => item.title !== title);
    localStorage.setItem('notes', JSON.stringify(updatedItems));
}



function hide_error () {
    error.style.display = 'none';
}

function show_menu() {
    menu.style.display = 'block'; // 显示 menu
    overlay.style.display = 'block'; // 显示遮罩层
}

function hide_menu() {
    menu.style.display = 'none'; // 隐藏 menu
    overlay.style.display = 'none'; // 隐藏遮罩层
}

function hide_view() {
    view.style.display = 'none';
}

function show_view() {
    view.style.display = 'block';
}



function clear_menu() {
    // 清空内容
    user_title.value = '';
    user_description.value = '';
  }

  const overlay = document.getElementById('overlay');
  const closeViewButton = document.getElementById('close_view');
  
  // 显示遮罩层和 view box
  function show_view() {
      overlay.style.display = 'block'; // 显示遮罩层
      view.style.display = 'block'; // 显示 view box
  }
  
  // 隐藏遮罩层和 view box
  function hide_view() {
      overlay.style.display = 'none'; // 隐藏遮罩层
      view.style.display = 'none'; // 隐藏 view box
  }
  
  // 绑定关闭按钮事件
  closeViewButton.addEventListener('click', hide_view);
  
  // 关闭遮罩层的点击事件（可选，如果不需要点击遮罩关闭，可以移除此代码）
  overlay.addEventListener('click', () => {
    hide_menu();
    hide_view();
});
  