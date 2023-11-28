export const parseHtml = (idParoquia, nome, image, data) => {
	const termosEnd = [
		'endereço', 'endereços',
		'endereco', 'enderecos',
		'endererço', 'endererços',
		'endererco', 'enderercos',
		'enderaço', 'enderaços',
		'enderaco', 'enderacos',
		'enderarço', 'enderarços',
		'enderarco', 'enderarcos'];
	const termosMap = [
		'(ver mapa)', '( ver mapa )', '(mapa)', '( mapa )'
	]
	const cheerio = require('react-native-cheerio');
	const html = data.replace(/<br \/>/g, '\n\n');
	const $ = cheerio.load(html, { decodeEntities: false });
	const paragrafos = $('p');

	let resultado = '';
	let enderecos = [];
	let parsedImg = '';

	//Encontrar o endereço e também pegar o treco todo formatado legal
	paragrafos.each((index, paragrafo) => {


		const conteudo = $(paragrafo).text().trim();


		//PARTE QUE ENCONTRA O ENDEREÇO ========================================
		if (conteudo.toLowerCase().includes('ender')

		) {
			//TERMO ENCONTRADO DO ENDEREÇO VERIFICAR SE BATE COM OS TERMOS LÁ DE CIMA
			const termoEncontrado = termosEnd.find(termo => conteudo.toLowerCase().includes(termo))
			if (termoEncontrado) {

				//CORTA LITERALMENTE TUDO QUE TIVER ANTES DO ENDEREÇO
				let splitAddr = conteudo.toLowerCase().split(termoEncontrado)[1].trim()
				//REMOVE OS DOIS PONTOS TBM, FIQUEI COM MEDO DE FAZER TD JUNTO E DAR PROBLEMA

				splitAddr = splitAddr.split(':')[1]

				//MESMA COISA PARA OS ENDERECOS SÓ QUE AGORA PARA O VER MAPA-
				const termoMapEncontrado = termosMap.find(termo => splitAddr.includes(termo))
				if (termoMapEncontrado) {
					//EXCLUI TUDO QUE TIVER A PARTIR DO VER MAPA :)
					splitAddr = splitAddr.split(termoMapEncontrado)[0].trim()
				}

				enderecos.push(splitAddr)

			}

		}
		// ============================REMOVE OS BLOCOS DE HISTÓRIA============================

		//================ REMOVE OS TRECOS QUE COMEÇAM COM {} ===============================
		if (!conteudo.startsWith('{') && conteudo.length < 240) {
			if (conteudo !== '') {
				if (index !== 0) {
					resultado += '\n\n';
				}
				resultado += `${conteudo}\n`;
			}
		}
		//========================================================================
	});

	//Encontrar a imagem

	// Define a expressão regular para encontrar o caminho da imagem
	var regex = /\"image_intro\":\"(.*?)\"/;
	var match = image.match(regex);
	if (match && match[1]) {
		parsedImg = match[1].split("images\\/paroquias\\/")[1];
	} else {
		parsedImg = "SEM FOTO";
	}
	//Arruma o nome das paroquias
	let palavras = nome.split('-');
	for (var i = 0; i < palavras.length; i++) {
		palavras[i] = palavras[i].charAt(0).toUpperCase() + palavras[i].slice(1);
	}
	const nomeParsed = palavras.join(' ');

	const parsedData = {
		id: idParoquia,
		nome: nomeParsed,
		latitude: "",
		longitude: "",
		imagem: parsedImg,
		//Passando só o endereço principal por enquanto
		enderecos: enderecos[0],
		fullText: resultado
	};

	return parsedData

}