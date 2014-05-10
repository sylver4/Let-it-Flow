/*
 * letItFlow - jQuery Plugin
 * version: 1.0.0 (Fri, 04 April 2014)
 *
 * More info at http://sylverweb.be/letitflow/
 * MIT Licensed.
 *
 * Copyright 2014 Sylverweb - letitflow@sylverweb.be
 *
 */

(function ($) {
	$.fn.sylver = function (userParams) {
		// params par defaut
		var defaults = {
			maxWidth: '',
			maxHeight: '',
			themeColor: 'dark',
			colorText: 'light',
			colorBar: '#777',
			color2: '',
			datesBelow: false,
			flat: false,

			firstDay: '',
			lastDay: '',

			steps: [],
			stepsLabel: true,
			lastStepName: ''
		};
		var params = $.extend(defaults, userParams);

		return this.each(function () {
			var $t = $(this);

			$t.append('<div class="letItFlow"><div class="lif-progress"><div class="lif-bar"><span></span></div></div></div>');

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
				nStepsName: 0,
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
								this.nStepsName++;
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
					$('.lif-progress .lif-bar',$t).before('<div class="cuts"></div>');

					for (var i = 1; i < this.dates.length; i++) {
						// calcul pourcentage des étapes
						this.dates[i].sPerc = Math.abs((this.dates[i].sDate - params.firstDay) / this.totalLength) * 100;
						// calcul largeur des étapes
						this.dates[i].sWidth = (this.dates[i].sPerc - this.dates[i - 1].sPerc).toFixed(4);
						// séparation sur la bar
						$('.cuts',$t).append('<span title="' + this.dates[i].sName + '" style="width:' + this.dates[i].sWidth + '%;"> </span>');
					}

					if (this.nStepsName) {
						$('.endsDates',$t).after('<div class="stepTooltip"></div>');
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
					$('.lif-progress',$t).before('<div class="lif-steps"></div>');
					for (var i = 1; i < this.dates.length; i++) {
						$pWidth = this.dates[i].sWidth;
						$('.lif-steps',$t).append('<p class="step' + [i] + '" style="width:' + $pWidth + '%;"><span>' + this.dates[i].sName + '</span></p>');
						this.labWidth[i] = $('.lif-steps .step' + [i] + ' span').width();
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
					$('.letItFlow',$t).removeClass('light');
					if(params.themeColor == 'light') {
						$('.letItFlow',$t).addClass('light');
					}
				},
				// couleur de la bar
				bColor: function () {
					$('.lif-bar',$t).css('background-color', params.colorBar);
				},
				textColor: function () {
					switch (params.colorText) {
					case 'dark':
						$('.lif-bar',$t).css({
							'color': '#333',
							'text-shadow': '0px 1px 0 rgba(255,255,255,0.7)'
						});
						break;
					case 'light':
						$('.lif-bar',$t).css({
							'color': '#FFF',
							'text-shadow': '0px 1px 0 rgba(0,0,0,0.7)'
						});
						break;
					default:
						break;
					}
				},
				bGradient: function () {
					$('.lif-bar',$t).css({
						"background": params.colorBar,
						"background": "-moz-linear-gradient(left, " + params.colorBar + " 0%, " + params.color2 + " 100%)", /* FF3.6+ */					
						"background": "-webkit-gradient(linear, left top, right top, color-stop(0%," + params.colorBar + "), color-stop(100%," + params.color2 + "))",
						"background": "-webkit-linear-gradient(left,  " + params.colorBar + " 0%," + params.color2 + " 100%)"
					});
					$('.lif-bar',$t).css({
						"background": "-o-linear-gradient(left,  " + params.colorBar + " 0%," + params.color2 + " 100%)",
						"background": "-ms-linear-gradient(left,  " + params.colorBar + " 0%," + params.color2+")",
						"background": "linear-gradient(to right,  " + params.colorBar + " 0%," + params.color2 + " 100%)",
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
						if (params.stepsLabel) {
							model.addLabels();
							$('.letItFlow',$t).removeClass('no-labels');
						} else {
							$('.letItFlow',$t).addClass('no-labels');
						}
					}
					this.windowResize();
				},
				barInitViews: function () {
					colorBar.layoutColor();
					startDate = '<div class="start">' + model.formatEndsDates(params.firstDay) + '</div>';
					endDate = '<div class="end">' + model.formatEndsDates(params.lastDay) + '</div>';
					$('.lif-progress',$t).after('<div class="endsDates">' + startDate + endDate + '</div>');
					colorBar.textColor();
					if (params.color2) {
						colorBar.bGradient();
					} else {
						colorBar.bColor();
					}
					if(params.maxWidth) {
						$('.letItFlow',$t).css('max-width',params.maxWidth);
					}
					if(params.maxHeight) {
						heightVal = params.maxHeight.replace(/[^-\d\.]/g, '');
						if(heightVal < 21) {
							$('.letItFlow',$t).addClass('small');
							if (heightVal < 11) {
								$('.letItFlow',$t).removeClass('small');
								$('.letItFlow',$t).addClass('xsmall');
							}
						}
						$('.lif-progress',$t).css('height',params.maxHeight);
						newLineH = (heightVal - 2) +'px';
						$('.lif-progress .lif-bar span',$t).css('line-height',newLineH);
					}
					if(params.datesBelow) {
						$('.letItFlow',$t).addClass('below');
					}
					if(params.flat) {
						$('.letItFlow',$t).addClass('flat');
					}
				},
				barUpdateViews: function () {
					if (model.totalProgression < 100) {
						// définir largeur progression
						$('.lif-bar',$t).width(model.totalProgression + '%');
						// afficher %
						$('.lif-bar span',$t).html(model.totalPercents + ' %');
					} else {
						$('.lif-bar',$t).width('100%');
						$('.lif-bar span',$t).html('100 %');
					}
					if (model.totalPercents < 8) {
						$('.hoverinfo',$t).remove();
						$('.lif-bar',$t).before('<span class="hoverinfo">' + model.totalPercents + ' %</span>');
					} else {
						$('.hoverinfo',$t).remove();
					}
					this.labelHighlight();
				},
				labelHighlight: function () {
					for (var i = 1; i < model.dates.length; i++) {
						// hightlight sur les mots
						if ((model.dates[i].sPerc - model.dates[i].sWidth) < model.totalProgression) {
							$('.lif-steps .step' + [i],$t).css('opacity', '1');
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