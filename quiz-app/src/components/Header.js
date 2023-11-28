function Header() {

    return (
        <div className='Header'>
            <p>Header space</p>
            <div style={joker_group}>
                <p>Joker:</p>
                <div style={joker}></div>
                <div style={joker}></div>
                <div style={joker}></div>
                <div style={joker}></div>
            </div>
        </div>
    )
}

const joker_group = {
    display: 'flex',
    flexDirection: 'row'
}

const joker = {
    backgroundColor: '#d177b3',
    borderRadius: '50px', //camelCase instead of kebab-case
    width: '30px',
    height: '30px',
    marginLeft: '10px',
    marginTop: '15px'
}

export default Header;