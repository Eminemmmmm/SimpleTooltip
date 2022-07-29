'use strict';

(() => {
	const style = new ST.Style({ classList: ['dark-blue'], ratio: 0.15, tipColor: '#4051b5', useHTML: true, position: 'bottom', transition: { delay: [0, 500], duration: [200, 200] } });
	style.generateFromTitle(ST.Selector('.with-tooltip'));
})();

(() => {
	const style = new ST.Style({
		position: 'bottom',
		tipSize: '10px',
		transition: { delay: [0, 500], duration: [200, 500] }
	});
	style.generateFromChild(ST.Selector('#button-def u'));
})();

(() => {
	const style = new ST.Style({ classList: ['blue'], tipColor: '#1d9ce5', useHTML: true, position: 'top', transition: { delay: [0, 500], duration: [200, 500] } });
	style.generateFromChild(ST.Selector('#tooltip-def u'));
	style.generateFromTitle(ST.Selector('#tooltip-def u'));
})();

(() => {
	const style = new ST.Style({ classList: ['blue'], tipColor: '#1d9ce5', relativeTo: 'cursor', transition: { delay: [0, 100] }});
	const pic = document.getElementById('fsn');
	const sakura = [[101, 18], [133, 24], [136, 52], [106, 74], [90, 64], [81, 38]];
	const saber = [[224, 16], [253, 10], [275, 30], [269, 60], [250, 72], [225, 56], [213, 32]];
	const rin = [[386, 10], [405, 18], [406, 47], [391, 64], [376, 63], [360, 45], [365, 18]];
	style.generateOne(pic, () => 'Sakura', sakura);
	style.generateOne(pic, () => 'Artoria (Saber)', saber);
	style.generateOne(pic, () => 'Rin', rin);
})();

(() => {
	const style = new ST.Style();
	const box = document.querySelector('div.alignment > div');
	const height = document.querySelector('#height');
	style.generateFromTitle(ST.NodeList([box]));
	document.querySelector('form.alignment').onsubmit = function(e) {
		e.preventDefault();
		ST.removeOne(box);
		box.innerHTML = `height = ${height.value}px`;
		box.style.height = `${height.value}px`;
		box.style.lineHeight = `${height.value}px`;
		style.generateFromTitle(ST.NodeList([box]));
	}
})();

(() => {
	const delayIn = document.querySelector('#delay-in');
	const delayOut = document.querySelector('#delay-out');
	const durationIn = document.querySelector('#duration-in');
	const durationOut = document.querySelector('#duration-out');
	const box = document.querySelector('div.transition > div');
	const update = () => {
		(new ST.Style({ transition: { delay: [delayIn.value, delayOut.value], duration: [durationIn.value, durationOut.value] } })).generateFromTitle(ST.NodeList([box]));
	};
	update();
	
	document.querySelector('form.transition').onsubmit = function(e) {
		e.preventDefault();
		ST.removeOne(box);
		box.innerHTML = `<code>delay = [${delayIn.value}, ${delayOut.value}], duration = [${durationIn.value}, ${durationOut.value}]</code>`;
		update();
	}
})();
