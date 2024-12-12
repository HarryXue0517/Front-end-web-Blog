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
    const store_isDark = localStorage.getItem('theme') === 'true';
    isDark = store_isDark !== null ? store_isDark : true; // 如果存储值不存在，默认为 true
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
    applyTheme();
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
let isDark = true;
const bgToggleBtn = document.getElementById('bgToggle');
const title = document.querySelector('#title');
const seasonOptions = document.querySelectorAll('#season option');
const store_isDark = localStorage.getItem('theme') === 'true';
isDark = store_isDark !== null ? store_isDark : true; // 如果不存在，默认为 true（暗色模式）
bgToggleBtn.addEventListener('click', () => {
    const body = document.body;
    // if (isDark) { // 亮色
    //     body.style.backgroundColor = 'rgb(237, 237, 237)'; // Light background
    //     body.style.color = '#000000'; // Dark text
    //     bgToggleBtn.style.backgroundColor = 'rgb(222, 222, 222)';
    //     bgToggleBtn.style.color = '#000000';
    //     bgToggleBtn.innerHTML = 'Dark';
    //     title.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.3)';
    //     title.style.color = 'rgb(34, 34, 34)';
    //     seasonFilter.style.backgroundColor =  'rgb(222, 222, 222)';
    //     seasonFilter.style.color = 'black';
    //     menu.style.color = 'black';
    //     menu.style.backgroundColor = 'white';
    //     seasonOptions.forEach(option => {
    //         option.style.backgroundColor = 'rgb(222, 222, 222)'; // 设置背景颜色
    //         option.style.color = 'rgb(34, 34, 34)'; // 设置字体颜色
    //     });
    // } else { // 暗色
    //     body.style.backgroundColor = '#232323'; // Original dark background
    //     bgToggleBtn.style.backgroundColor = 'rgb(60, 60, 60)';
    //     bgToggleBtn.style.color = 'white';
    //     bgToggleBtn.innerHTML = 'Bright';
    //     title.style.color = 'white';
    //     seasonFilter.style.backgroundColor =  'rgb(60, 60, 60)';
    //     seasonFilter.style.color = 'white';
    //     seasonOptions.forEach(option => {
    //         option.style.backgroundColor = 'rgb(60, 60, 60)'; // 设置背景颜色
    //         option.style.color = 'rgb(255, 255, 255)'; // 设置字体颜色
    //     });
    // }
    isDark = !isDark; // 切换主题
    localStorage.setItem('theme', isDark); // 保存主题到 Local Storage
    applyTheme(); // 应用新主题
});

let view_driver = document.querySelector('#view-divider');

function applyTheme() {
    const body = document.body;
    if (isDark) { // 暗色模式
        body.style.backgroundColor = '#232323';
        body.style.color = '#FFFFFF';
        bgToggleBtn.style.backgroundColor = 'rgb(60, 60, 60)';
        bgToggleBtn.style.color = 'white';
        bgToggleBtn.innerHTML = 'Bright';
        title.style.color = 'white';
        seasonFilter.style.backgroundColor = 'rgb(60, 60, 60)';
        seasonFilter.style.color = 'white';
        seasonOptions.forEach(option => {
            option.style.backgroundColor = 'rgb(60, 60, 60)';
            option.style.color = 'white';
        });
        menu.style.backgroundColor = '#232323';
        menu.style.color = '#FFFFFF'
        user_title.style.backgroundColor = '#333333';
        user_title.style.color = '#f8f8f8';
        user_category.style.backgroundColor = '#333333';
        user_category.style.color = '#f8f8f8';
        user_description.style.backgroundColor = '#333333';
        user_description.style.color = '#f8f8f8';
        save.style.backgroundColor = '#333333';
        save.style.color = '#f8f8f8';
        cancle.style.backgroundColor = '#333333';
        cancle.style.color = '#f8f8f8';

        view.style.backgroundColor = '#333333';
        view.style.color = '#f8f8f8';
        close_view.style.backgroundColor = 'rgb(60, 60, 60)';
        close_view.style.color = 'white';

        view_driver.style.border = '0.1px solid rgb(214, 214, 214)';
    } else { // 明亮模式
        body.style.backgroundColor = 'rgb(235, 234, 233)';
        body.style.color = '#000000';
        bgToggleBtn.style.backgroundColor = 'rgb(221, 219, 217)';
        bgToggleBtn.style.color = '#000000';
        bgToggleBtn.innerHTML = 'Dark';
        title.style.color = 'rgba(0, 0, 0, 0.89)';
        title.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.3)';
        seasonFilter.style.backgroundColor = 'rgb(221, 219, 217)';
        seasonFilter.style.color = '#000000';
        seasonOptions.forEach(option => {
            option.style.backgroundColor = 'rgb(222, 222, 222)';
            option.style.color = '#000000';
        });
        menu.style.backgroundColor = 'rgb(235, 234, 233)';
        menu.style.color = 'rgba(0, 0, 0, 0.89)';
        user_title.style.backgroundColor = 'rgb(221, 219, 217)';
        user_title.style.color = 'black';
        user_category.style.backgroundColor = 'rgb(221, 219, 217)';
        user_category.style.color = 'black';
        user_description.style.backgroundColor = 'rgb(221, 219, 217)';
        user_description.style.color = 'black';
        save.style.backgroundColor = 'rgb(221, 219, 217)';
        save.style.color = 'black';
        cancle.style.backgroundColor = 'rgb(221, 219, 217)';
        cancle.style.color = 'black';

        view.style.backgroundColor = 'rgb(235, 234, 233)';
        view.style.color = 'rgba(0, 0, 0, 0.74)';
        close_view.style.backgroundColor = 'rgb(221, 219, 217)';
        close_view.style.color = '#000000';
        
        view_driver.style.border = '0.1px solid rgb(21, 21, 21)';
    }
}


  