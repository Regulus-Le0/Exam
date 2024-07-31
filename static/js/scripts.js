// static/js/scripts.js
document.addEventListener("DOMContentLoaded", function() { // 当DOM完全加载后执行
    const subjectNav = document.getElementById("subject-nav"); // 获取科目导航元素
    const selectedSubjectName = document.getElementById("selected-subject-name");
    const chapterList = document.getElementById("chapter-list"); // 获取章节列表元素

    // 获取所有科目信息
    fetch('/subjects') // 发送请求获取所有科目数据
        .then(response => response.json()) // 解析响应数据为JSON
        .then(subjects => { // 遍历所有科目
            subjects.forEach(subject => {
                const link = document.createElement("a"); // 创建链接元素
                link.href = "#"; // 设置链接地址为#
                link.textContent = subject; // 设置链接文本内容为科目名称
                link.onclick = function(event) { // 点击事件处理
                    event.preventDefault(); // 阻止链接默认行为
                    loadChapters(subject); // 加载章节
                    selectedSubjectName.textContent = subject;
                    setActiveLink(this); // 设置活动链接
                };
                subjectNav.appendChild(link); // 将链接添加到科目导航中
            });
        })
        .catch(error => console.error('Error:', error)); // 捕获并打印错误

    // 设置活动链接样式
    function setActiveLink(link) {
        const links = subjectNav.querySelectorAll("a"); // 获取所有链接
        links.forEach(l => l.classList.remove("active")); // 移除所有链接的活动状态
        link.classList.add("active"); // 添加点击链接的活动状态
    }

function toggleChildChapters(chapterElement) {
    console.log('Clicked chapter:', chapterElement.textContent);

    const subchapterContainer = chapterElement.parentElement.querySelector(".child-chapter-name");

    if (subchapterContainer) {
        if (subchapterContainer.style.display === "block") {
            subchapterContainer.style.display = "none";
        } else {
            fetch(`/subchapters/${selectedSubjectName.textContent}/${chapterElement.textContent.trim()}`)
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP ${response.status} error`);
                    return response.json();
                })
                .then(subchapters => {
                    console.log('Loaded subchapters:', subchapters);
                    subchapterContainer.innerHTML = ''; // 清空子章节列表
                    subchapters.forEach(subchapter => {
                        const subchapterItem = document.createElement("li");
                        const subchapterName = document.createElement("span");
                        subchapterName.className = "child-chapter-name";
                        subchapterName.textContent = subchapter.name;

                        subchapterItem.appendChild(subchapterName);
                        subchapterContainer.appendChild(subchapterItem);
                    });

                    subchapterContainer.style.display = "block";
                })
                .catch(error => {
                    console.error('Error fetching subchapters:', error);
                    subchapterContainer.style.display = "none";
                    alert('无法加载子章节，请稍后再试。');
                });
        }
    } else {
        console.error('Subchapter container not found.');
    }
}

// 在创建章节时确保使用正确的类名
function loadChapters(subjectName) {
    fetch(`/chapters/${subjectName}`)
        .then(response => response.json())
        .then(chapters => {
            console.log('Loaded chapters for', subjectName, chapters);
            chapterList.innerHTML = ''; // 清空章节列表
            chapters.forEach(chapter => {
                const chapterItem = document.createElement("li");
                const chapterName = document.createElement("span");
                chapterName.className = "chapter-name";
                chapterName.textContent = chapter.name;
                chapterName.onclick = function() {
                    toggleChildChapters(this);
                };

                chapterItem.appendChild(chapterName);

                const childChapterContainer = document.createElement("ul");
                childChapterContainer.className = "child-chapter-name";
                childChapterContainer.style.display = "none";

                if (chapter.subchapters) {
                    chapter.subchapters.forEach(subchapter => {
                        const subchapterItem = document.createElement("li");
                        const subchapterName = document.createElement("span");
                        subchapterName.textContent = subchapter.name;

                        subchapterItem.appendChild(subchapterName);
                        childChapterContainer.appendChild(subchapterItem);
                    });
                }

                chapterItem.appendChild(childChapterContainer);
                chapterList.appendChild(chapterItem);
            });
        })
        .catch(error => console.error('Error:', error));
}
});