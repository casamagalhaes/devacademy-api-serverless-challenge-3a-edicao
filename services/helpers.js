module.exports = class Helpers {
	static filterItemsByName(filterName, items) {
		return items.filter((item) => {
			/* Split a string such as 'John Doe' into [John, Doe] */
			let namesArr = item.name.split(' ');
			namesArr = this.lowerCaseStrArray(namesArr);

			return namesArr.includes(filterName.toLowerCase());
		});
	}

	static lowerCaseStrArray(arr) {
		return arr.map((str) => str.toLowerCase());
	}
};
