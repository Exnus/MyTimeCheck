/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
	'use strict';

    // Создаем основную вьюху для приложения
	app.AppView = Backbone.View.extend({

		// Вместо генерации нового элемента, подключаемся к существующему в базовой разметке базовый контейнер
		// Основной контейнер
		el: '#todoapp',

		// Создаем шаблон строки статистики с фильтром
		statsTemplate: _.template($('#stats-template').html()),

		// Задаем события для отслеживания и действий
		events: {
			'keypress #new-todo': 'createOnEnter',
            'click .create': 'createOnButton',
			'click #clear-completed': 'clearCompleted',
			'click #toggle-all': 'toggleAllComplete'
 		},

		// При инициализации связываемся с различными событиями
		// Обновление данных при совершении действий
		// Загрузка данных из *localStorage*.
		initialize: function () {
			this.allCheckbox = this.$('#toggle-all')[0];
			this.$input = this.$('#new-todo');
			this.$panel = this.$('#panel');
            this.$gantt = this.$('.gantt');
			this.$main = this.$('#main');

            this.listenTo(app.todos, 'change', this.ganttRender);
			this.listenTo(app.todos, 'add', this.addOne);
			this.listenTo(app.todos, 'reset', this.addAll);
			this.listenTo(app.todos, 'change:completed', this.filterOne);
			this.listenTo(app.todos, 'filter', this.filterAll);
			this.listenTo(app.todos, 'all', this.render);

			app.todos.fetch();
		},

		// Re-rendering the App just means refreshing the statistics -- the rest
		// of the app doesn't change.
		render: function () {
			var completed = app.todos.completed().length;
			var remaining = app.todos.remaining().length;

            this.ganttRender();

			if (app.todos.length) {
				this.$main.show();
				this.$panel.show();

				this.$panel.html(this.statsTemplate({
					completed: completed,
					remaining: remaining
				}));

				this.$('#filters li a')
					.removeClass('selected')
					.filter('[href="#/' + (app.TodoFilter || '') + '"]')
					.addClass('selected');
			} else {
				this.$main.hide();
				this.$panel.hide();
			}

			this.allCheckbox.checked = !remaining;
		},

		// Добавление элемента в список с созданием вьюхи для него
		// Добавление в `<ul>`.
		addOne: function (todo) {
			var view = new app.TodoView({ model: todo });
			$('#todo-list').prepend(view.render().el);
		},

		// Добавление всех записей в коллекцию **Todos** разом
		addAll: function () {
			this.$('#todo-list').html('');
			app.todos.each(this.addOne, this);
		},

		filterOne: function (todo) {
			todo.trigger('visible');
		},

		filterAll: function () {
			app.todos.each(this.filterOne, this);
		},

		// Создание атрибутов для новой записи
		newAttributes: function () {
            //Собираем дату дедлайна в юникс формат
            function humanToTime() {
                function stripLeadingZeroes(data) {
                    if((data.length > 1) && (data.substr(0,1) == "0"))
                        return data.substr(1);
                    else
                        return data;
                }
                var humDate = new Date(Date.UTC($('#inYear').val(),
                    stripLeadingZeroes($('#inMon').val()-1),
                    stripLeadingZeroes($('#inDay').val()),
                    stripLeadingZeroes($('#inHr').val()),
                    stripLeadingZeroes($('#inMin').val()),
                    stripLeadingZeroes($('#inSec').val()))
                );
                return humDate.getTime();
            }

            //Добавляем атрибуты
			return {
				title: this.$input.val().trim(),
                endDate: humanToTime(),
				order: app.todos.nextOrder(),
				completed: false
			};
		},

		// Создание новой модели при заполненном инпуте и нажатии энтер
		// сохранение в *localStorage*.
		createOnEnter: function (e) {
			if (e.which !== ENTER_KEY || !this.$input.val().trim()) {
				return;
			}

			app.todos.create(this.newAttributes());
			this.$input.val('');
		},

        createOnButton: function (e) {
            if (!this.$input.val().trim()) {
                return;
            }

            app.todos.create(this.newAttributes());
            this.$input.val('');
        },

		// Очистить от завершенных записей, удалить соответствующие модели
		clearCompleted: function () {
			_.invoke(app.todos.completed(), 'destroy');
			return false;
		},

		toggleAllComplete: function () {
			var completed = this.allCheckbox.checked;

			app.todos.each(function (todo) {
				todo.save({
					'completed': completed
				});
			});
        },

        ganttRender: function () {
            function GetGanttData (key) {
                var sources = new Array();
                var gantt_colors = ['ganttRed', 'ganttGreen', 'ganttBlue', 'ganttOrange', 'ganttPink', 'ganttYel', 'ganttAqua', 'ganttDarkGreen'];
                for (var val= 0; val<app.todos.models.length; val++) {

                    var num_color = Math.floor(Math.random() *gantt_colors.length); //alert(num_color);
                    sources[val] = {
                        values: [{
                            from: '/Date('+app.todos.models[val].get('createDate')+')/',
                            to: '/Date('+app.todos.models[val].get('endDate')+')/',
                            label: app.todos.models[val].get('title'),
                            customClass: gantt_colors[num_color]+' num'+val
                        }]
                    };
                    gantt_colors.splice(num_color, 1);
                    //alert(JSON.stringify(gantt_colors));
                }
                //console.log(JSON.stringify(sources));
                return sources;
            }


            this.$gantt.gantt({
                source: GetGanttData(app.todos.models),
                navigate: "scroll",
                maxScale: "hours",
                itemsPerPage: 10,
                onItemClick: function(data) {
                    //alert("Item clicked - show some details");
                    $(function () {
                        var num = data.slice(data.length-1, data.length);
                        var sources = GetGanttData(app.todos.models);
                        var NowTime = new Date().getTime();
                        var LeftTime = (sources[num].values[0].to);
                        var Desc = (sources[num].values[0].label);

                        LeftTime = Number(LeftTime.slice(6, LeftTime.length-2))/1000;
                        var NowGMT = 3600*(new Date().getTimezoneOffset()/60);
                        NowTime = (Number(NowTime)/1000)-NowGMT;

                        //LeftTime = new Date(LeftTime);
                        //console.log(num, LeftTime, NowTime, NowGMT, Desc);
                        $('.clock .container h2').html('Событие <span class="eventName">&laquo;'+Desc+'&raquo;</span> наступит через:');
                        $('.EventDate p').text(new Date(LeftTime*1000).toGMTString());

                        $('.clock').animate({height: '280px'}, 1000);
                        $('.clock .container').show();

                        JBCountDown({
                            startDate: '',
                            endDate: LeftTime,
                            nowDate: NowTime
                        });
//                        $('#Countdown').countdown({until: LeftTime, format: 'YODHMS', description: Desc});
//                        $('#Countdown').countdown('option', {until: LeftTime, description: Desc});

                    });
                },
                onAddClick: function(dt, rowId) {
                    alert("Empty space clicked - add an item!");
                },
                onRender: function() {
                    $('.wall').height(function(i, val){
                        return $('.gantt').height()
                    });
                    $('.fn-gantt .today .line').height(function(i, val){
                        return $('.gantt').height()
                    });
//                        if (window.console && typeof console.log === "function") {
//                            console.log("chart rendered");
//                        }
                }
            });
        }



	});
})(jQuery);
