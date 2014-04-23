(function ($) {
	$.fn.sylver = function (userParams) {
		// params par defaut
		var defaults = {
			maxWidth: '',
			themeColor: 'dark',
			colorText: 'light',
			colorBar: '#777',
			color2: '',

			firstDay: '',
			lastDay: '',

			steps: [],
			stepsLabel: true,
			labelTooltip: true,
			lastStepName: ''
		};
		var params = $.extend(defaults, userParams);

		return this.each(function () {
			var $t = $(this);

			$t.append('<div class="progressBar" style="max-width:'+params.maxWidth+';"><div class="progress"><div class="bar"><span></span></div></div></div>');

			$(function () {
				global.init();
				setInterval(function () {
					model.progression();
				}, 3600);
			});
			var global = {
				init: function () {
					views.initViews();
				}
			};
			var model = {
				totalLength: 0,
				totalProgression: null,
				nSteps: 0,
				dates: [],
				labWidth: [],
				progression: function () {
					var toDay = $.now();
					this.totalLength = params.lastDay - params.firstDay;
					if(toDay > params.firstDay) {
						this.totalProgression = Math.abs((toDay - params.firstDay) / this.totalLength) * 100;
					}  else {
		                this.totalProgression = 0;
		            }
					this.totalPercents = this.totalProgression.toFixed(0);
					views.barUpdateViews();
				},
				getSteps: function (obj) {
					for (property in obj) {
						this.nSteps++;
					}
					for (var i = 0; i < this.nSteps; i++) {
						if (obj[i]) {
							if(obj[i].stepName) {
								stepName = obj[i].stepName;
							} else {
								stepName = '';
							}
							stepDate = new Date(obj[i].stepDate);
						}
						this.dates.push({
							sName: stepName,
							sDate: stepDate,
							sPerc: '',
							sWidth: ''
						});
					};
				},
				createSteps: function () {
					this.dates = [{
						sName: params.firstDayName,
						sDate: params.firstDay,
						sPerc: '0',
						sWidth: '0'
					}, {
						sName: params.lastStepName,
						sDate: params.lastDay,
						sPerc: '100',
						sWidth: '100'
					}];
					model.getSteps(params.steps);
					// réorganise par date
					this.dates.sort(function (x, y) {
						return x.sDate - y.sDate;
					})
					$('.progress .bar',$t).before('<div class="cuts"></div>');
					$('.endsDates',$t).after('<div class="stepTooltip"></div>');
					for (var i = 1; i < this.dates.length; i++) {
						// calcul pourcentage des étapes
						this.dates[i].sPerc = Math.abs((this.dates[i].sDate - params.firstDay) / this.totalLength) * 100;
						// calcul largeur des étapes
						this.dates[i].sWidth = (this.dates[i].sPerc - this.dates[i - 1].sPerc).toFixed(4);
						// séparation sur la bar
						$('.cuts',$t).append('<span title="' + this.dates[i].sName + '" style="width:' + this.dates[i].sWidth + '%;"> </span>');
					}
					if (params.labelTooltip) {
						var delayID;
						$('.cuts span', $t).css('cursor','pointer');
						$('.cuts span, .tt',$t).on("click", function () {
							thisName = $(this).attr('title');
							$('.stepTooltip',$t).html('<span>' + thisName + '</span>').fadeIn('fast');
							clearTimeout(delayID);
							delayID = setTimeout(function () {
								$('.stepTooltip span',$t).fadeOut('slow')
							}, 1800);
						});
					}
				},
				addLabels: function () {
					$('.progress',$t).before('<div class="steps"></div>');
					for (var i = 1; i < this.dates.length; i++) {
						$pWidth = this.dates[i].sWidth;
						$('.steps',$t).append('<p class="step' + [i] + '" style="width:' + $pWidth + '%;"><span>' + this.dates[i].sName + '</span></p>');
						this.labWidth[i] = $('.steps .step' + [i] + ' span').width();
					}
					// highlight
					views.labelHighlight();
					views.labelWidth();
				},
				formatEndsDates: function (mydate) {
					newDD = ('0' + mydate.getDate()).slice(-2);
					newMM = ('0' + (mydate.getMonth() + 1)).slice(-2);
					newYY = mydate.getFullYear();
					newDate = '<span class="dateday">' + newDD + '</span>';
					newDate += '<span class="datemonth">' + newMM + '</span>';
					newDate += '<span class="dateyear">' + newYY + '</span>';
					return newDate;
				}
			};
			var colorBar = {
				layoutColor: function() {
					$('.progressBar',$t).removeClass('light');
					if(params.themeColor == 'light') {
						$('.progressBar',$t).addClass('light');
					}
				},
				// couleur de la bar
				bColor: function () {
					$('.bar',$t).css('background-color', params.colorBar);
				},
				textColor: function () {
					switch (params.colorText) {
					case 'dark':
						$('.bar',$t).css({
							'color': '#333',
							'text-shadow': '0px 1px 0 rgba(255,255,255,0.7)'
						});
						break;
					case 'light':
						$('.bar',$t).css({
							'color': '#FFF',
							'text-shadow': '0px 1px 0 rgba(0,0,0,0.7)'
						});
						break;
					default:
						break;
					}
				},
				bGradient: function () {
					$('.bar',$t).css({
						"background": params.colorBar,
						"background": "-moz-linear-gradient(left, " + params.colorBar + " 0%, " + params.color2 + " 96%, #ffffff 100%)", /* FF3.6+ */					
						"background": "-webkit-gradient(linear, left top, right top, color-stop(0%," + params.colorBar + "), color-stop(98%," + params.color2 + "), color-stop(100%,#ffffff))",
						"background": "-webkit-linear-gradient(left,  " + params.colorBar + " 0%," + params.color2 + " 96%,#ffffff 100%)"
					});
					$('.bar',$t).css({
						"background": "-o-linear-gradient(left,  " + params.colorBar + " 0%," + params.color2 + " 96%,#ffffff 100%)",
						"background": "-ms-linear-gradient(left,  " + params.colorBar + " 0%," + params.color2+")",
						"background": "linear-gradient(to right,  " + params.colorBar + " 0%," + params.color2 + " 96%,#ffffff 100%)",
						"filter": "progid:DXImageTransform.Microsoft.gradient( startColorstr='" + params.colorBar + "', endColorstr='" + params.color2 + "',GradientType=1 )",
						"-ms-filter": "progid:DXImageTransform.Microsoft.gradient(startColorstr='" + params.colorBar + "', endColorstr='" + params.color2 + "')"
					});
				}
			};
			var views = {
				initViews: function () {
					model.progression();
					this.barInitViews();
					if (params.steps.length) {
						model.createSteps();
					}
					if (params.stepsLabel) {
						model.addLabels();
						$('.progressBar',$t).removeClass('no-labels');
					} else {
						$('.progressBar',$t).addClass('no-labels');
					}
					this.windowResize();
				},
				barInitViews: function () {
					colorBar.layoutColor();
					startDate = '<div class="start">' + model.formatEndsDates(params.firstDay) + '</div>';
					endDate = '<div class="end">' + model.formatEndsDates(params.lastDay) + '</div>';
					$('.progress',$t).after('<div class="endsDates">' + startDate + endDate + '</div>');
					colorBar.textColor();
					if (params.color2) {
						colorBar.bGradient();
					} else {
						colorBar.bColor();
					}
				},
				barUpdateViews: function () {
					if (model.totalProgression < 100) {
						// définir largeur progression
						$('.bar',$t).width(model.totalProgression + '%');
						// afficher %
						$('.bar span',$t).html(model.totalPercents + ' %');
					} else {
						$('.bar',$t).width('100%');
						$('.bar span',$t).html('100 %');
					}
					if (model.totalPercents < 8) {
						$('.hoverinfo',$t).remove();
						$('.bar',$t).before('<span class="hoverinfo">' + model.totalPercents + ' %</span>');
					} else {
						$('.hoverinfo',$t).remove();
					}
					this.labelHighlight();
				},
				labelHighlight: function () {
					for (var i = 1; i < model.dates.length; i++) {
						// hightlight sur les mots
						if ((model.dates[i].sPerc - model.dates[i].sWidth) < model.totalProgression) {
							$('.steps .step' + [i],$t).css('opacity', '1');
						}
					}
				},
				labelWidth: function () {
					for (var i = 1; i < model.dates.length; i++) {
						stepOuter = $('.step' + [i],$t);
						stepOuterWid = stepOuter.width();
						stepInner = $('.step' + [i] + ' span',$t);
						stepInnerWid = model.labWidth[i];
						getName = model.dates[i].sName;
						if (stepOuterWid < stepInnerWid) {
							stepInner.html('<a class="tt" title="' + getName + '">■</a>');
						} else {
							stepInner.html(getName);
						}
					}
				},
				windowResize: function () {
					$(window).resize(function () {
						views.labelWidth();
					});
				}
			};
		});
	};
})(jQuery);