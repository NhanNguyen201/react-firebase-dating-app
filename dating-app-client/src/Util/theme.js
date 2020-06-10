export default {
    palette: {
        primary: {
          light: '#33c9dc',
          main: '#00bcd4',
          dark: '#008394',
          contrastText: '#fff'
        },
        secondary: {
          light: '#ff6333',
          main: '#ff3d00',
          dark: '#b22a00',
          contrastText: '#fff'
        }
    },
    typography: {
        useNextVariants: true
    },
    form: {
        textAlign: 'center'
    },
    image: {
        height: 100,
        width: 100,
        margin: '20px auto',
    },
    textField: {
        marginBottom: 20
    },
    textFieldEditForm: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
        padding: "5px 15px"
    },
    pageTitle: {
        letterSpacing: 15
    },
    button: {
        position: 'relative'
    },
    customeError: {
        color: 'red',
        fontSize: '0.8rem',
        marginTop: 20
    },
    seperater : {
        border: 'none',
        margin: 4
    },
    visibleSeperater : {
        width: "100%",
        borderBottom: " 1px solid rgba(0, 0, 0, 0.1)",
        marginBottom: 20
    },
    avatar: {
        height: 100,
        width: 100,
        borderRadius: "50%"
    }
}