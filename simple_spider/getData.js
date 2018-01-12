
// third-party modules
const cheerio = require('cheerio');

const getHTML = require('./getHTML_promise');

const scottHome = 'http://www.imooc.com/t/108492'; // scott 的主页

const courses = [];
// [
//   {
//     courseTitle: '进击 Node.js 基础',
//     courseURL: 'http://...',
//     number: '209384',
//     id: '3042',
//     chapters: [
//       {
//         chapterTitle: '第一章。。。',
//         videos: [
//           {
//             videoTitle: '第一节。。。',
//             videoURL: 'https://...'
//           }
//         ]
//       }
//     ]
//   }
// ]

/**
 * @type {Promise.<TResult>} - 下次 then 的参数就是 courses
 */

module.exports = getHTML(scottHome)
  .then((html) => {
    // 得到 scott 所有免费课程的链接及 ID
    const $ = cheerio.load(html);
    const courseAs = $('.moco-course-wrap a');
    courseAs.each((i, course) => {
      const $course = $(course);
      const url = $course.attr('href');
      courses.push({
        courseURL: `http://www.imooc.com${url}`,
        id: parseInt(/\d+$/.exec(url)[0], 10),
      });
    });
  })
  .then(() => {
    // 将获取各页面数据的 promise 合并成一个 promise
    const courseHTMLArr = courses.map(item => getHTML(item.courseURL));
    return Promise.all(courseHTMLArr);
  })
  .then((htmlArr) => {
    htmlArr.forEach((html, i) => {
      const $ = cheerio.load(html);
      const courseTitle = $('h2.l').text();

      // 获取此课程中的章节与章节中的课程
      const chapters = [];

      $('.chapter').each((cIndex, chapter) => {
        const $chapter = $(chapter);
        const $videos = $chapter.find('.J-media-item');

        const chapterTitle = $chapter.find('h3 strong').text().trim().replace(/\n(.|\s)*/, '');
        const videos = [];


        $videos.each((vIndex, video) => {
          const videoTitle = $(video).text().trim().replace(/\s*/g, '')
            .replace(/开始学习/, '');
          const videoURL = `http://www.imooc.com${$(video).attr('href')}`;
          videos.push({
            videoTitle,
            videoURL,
          });
        });

        chapters.push({
          chapterTitle,
          videos,
        });
      });

      // 将获取到的数据添加到相应的对象中
      courses[i] = Object.assign({}, courses[i], {
        courseTitle,
        chapters,
      });
    });
  })
  .then(() => {
    const numPromises = [];

    // 听课人数是通过 Ajax 获取的，所以要调用 promise 异步获得
    courses.forEach((item) => {
      const numPromise = getHTML(`http://www.imooc.com/course/AjaxCourseMembers?ids=${item.id}`);
      numPromises.push(numPromise);
    });

    return Promise.all(numPromises);
  })
  .then((numJSONArr) => {
    numJSONArr.forEach((json, i) => {
      courses[i].number = parseInt(JSON.parse(json).data[0].numbers, 10);
    });

    return courses;
  })
  .catch((e) => {
    console.log(e);
  });

