const http = require('http');

// third-party modules
const cheerio = require('cheerio'); // 服务器端的 jQuery

const conf = {
  url: 'http://www.imooc.com/learn/348',
};

function filterChapters(html) {
  const $ = cheerio.load(html);

  // [{
  //   chapterTitle: '',
  //   vidoes: [{
  //     title: '',
  //     id: '',
  //   }]
  // }]
  const chapters = $('.chapter');
  const course = [];

  chapters.each((i, item) => {
    const chapter = $(item);
    const chapterObj = {};
    chapterObj.videos = [];
    const reg = /.+(?=\n)/;
    [chapterObj.chapterTitle] = reg.exec(chapter.find('h3 strong').text().trim());

    chapter.find('ul.video').children('li').each((j, li) => {
      const video = $(li);
      const curVideo = {};
      curVideo.id = video.data('media-id');
      const regSpace = /\s+/g;
      curVideo.title = video.text().trim().replace(regSpace, ' ');
      chapterObj.videos.push(curVideo);
    });

    course.push(chapterObj);
  });

  return course;
}

http.get(conf.url, (res) => {
  let html = '';

  res.on('data', (data) => {
    html += data;
  });

  res.on('end', () => {
    const ret = filterChapters(html);
    console.log(JSON.stringify(ret, null, '-'));
  });
}).on('error', () => {
  console.log('Request failed.'); // eslint-disable-line
});
