export async function json(req, res) {
    // VAI LER TODO O CORPO DA REQUISIÇÃO
    const buffers = [] 

    //quando eu uso o await para trabalhar com streams, ele aguarda cada pedaço da stream retornar para poder seguir
    for await (const chunk of req){
        buffers.push(chunk) // percorre cada pedaço da req (chunk of req) e add esse pedaço dentro do array de buffers
    }

    // APÓS O CORPO TER SIDO LIDO POR COMPLETO (para criar um usuário posteriormente):
    try {
        req.body = JSON.parse(Buffer.concat(buffers).toString()) // convertendo para json (pois está indo como texto)
    } catch {
        req.body = null
    }

    res.setHeader('Content-type', 'application/json')
}