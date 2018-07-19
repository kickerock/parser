class Widget {
  constructor() {
    var container = document.getElementsByClassName('widget-container')[0];
    var containerTable = container.appendChild(document.createElement('table'));
    var dataNow;

    //  Запрос
    function makeReq() {

      var request = new XMLHttpRequest();
      request.onreadystatechange = function() {

        if (request.readyState === 4) {
          if (request.status === 200) {

            var dataNew = JSON.parse(request.responseText).sort().slice(1); //Первый элемент - Null, удаляю его
            if (dataNow == undefined) { //Первый заход - создаём/заполняем таблицу
              dataNow = dataNew;
              fillTable(dataNew, containerTable);
            } else if (dataNow == dataNew) { //Если ничего не изменилось
              console.log('Something bad happened');
            } else { //Есть изменения

              updateTable(containerTable, dataNow, dataNew);
            }


          } else {
            containerTable.innerHTML = 'Произошла ошибка при запросе: ' + request.status + ' ' + request.statusText;
          }
        }
      }

      request.open('Get', 'parse.php');
      request.send();
    }


    // Заполнятор
    function fillTable(data, tbl) {
      tbl.innerHTML = data.map(row => {
        var rowStr = row.map(val => `<td>${val}</td>`).join('')
        return `<tr>${rowStr}</tr>`
      }).join('')

    }

    // находим координаты изменившегося
    function getDifference(oldData, newData) {
      return newData.reduce((carry, row, i) => {
        carry[i] = row.reduce((rowChanges, val, j) => {
          if (val !== oldData[i][j]) {
            if (val > oldData[i][j]) {
              rowChanges[j] = val + '+' //Пометка, если изменения в + (increment)
            } else if (val < oldData[i][j]) {
              rowChanges[j] = val + '-' //Пометка, если изменения в - (decrement)
            }
          }
          // console.log(rowChanges)
          return rowChanges
        }, {})
        return carry
      }, [])
    }

    // обновитель таблицы только для нужных значений
    function updateTable(tbl, data1, data2) {
      // Обнуляю цвет ячеек
      var alltd = tbl.querySelectorAll('td');
      alltd.forEach(function(el) {
        el.style.backgroundColor = 'transparent';
      });

      var changes = getDifference(data1, data2)

      changes.forEach((row, i) => {
        var cells = tbl.querySelectorAll('tr:nth-child(' + (1 + i) + ') td');
        for (var key in row) {
          if (row[key].slice(-1) == "+") {
            cells[key].innerHTML = row[key].slice(0, -1);
            cells[key].style.backgroundColor = 'green';
          } else if (row[key].slice(-1) == "-") {
            cells[key].innerHTML = row[key].slice(0, -1);
            cells[key].style.backgroundColor = 'red';
          }
        }
      })
    }

    // Обработчик для кнопки остановки _Не обязателен_нет в ТЗ_
    var button = container.appendChild(document.createElement('button'));
    button.setAttribute('id', 'click');
    button.innerHTML = 'Stop!';
    document.getElementById('click').addEventListener('click', function() {
      clearInterval(inter);
    });

    // добавить стили
    var addLink = function(url) {
      var link = document.createElement('link');
      link.href = url;
      link.rel = 'stylesheet';
      link.type = 'text/css'; // no need for HTML5
      document.getElementsByTagName('head')[0].appendChild(link); // for IE6
    };
    addLink('widget.css');

    var inter = setInterval(makeReq, 3000); //Запуск таймера, с частотой обновления в мс
  }


}

var my = new Widget();
