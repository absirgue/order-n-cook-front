import Link from "next/link";
import { withRouter } from "next/router";
import classNames from "classnames";
import { Container, Navbar, Nav } from "react-bootstrap";
import Image from "next/image";
import logo from "../../images/logo.png";

export const NavLink = (props) => {
  let className = classNames({
    "nav-link": true,
    "is-active": props.pathname,
  });
  const pathname = window.location.pathname;
  return (
    <Link href={props.path} style={{ textDecoration: "none", color: "black" }}>
      <p
        className={
          window.location.pathname.split("/")[1] ==
          props.label.split(" ")[1].toLowerCase().replace("é", "e")
            ? className + "btn btn-primary"
            : className
        }
        style={
          window.location.pathname.split("/")[1] ==
          props.label.split(" ")[1].toLowerCase().replace("é", "e")
            ? { borderRadius: "10px", color: "white" }
            : null
        }
      >
        {props.label}
      </p>
    </Link>
  );
};

const Header = ({ router: { pathname } }) => (
  <header>
    <div id="wrapper-navbar">
      <Navbar
        bg="light"
        expand="lg"
        style={{
          borderBottom: "solid",
          borderColor: "#c2c1d1",
          borderWidth: "1px",
        }}
      >
        <Navbar.Brand className="ms-3">
          <Image src={logo} alt="Logo d'Order n'Cook" height={50} width={134} />
        </Navbar.Brand>
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <div className="col-12 d-flex flez-row justify-content-between">
              <Nav className="ml-auto">
                <NavLink
                  path="/recettes/toutes"
                  label="Mes Recettes"
                  pathname
                />
                <NavLink
                  path="/fournisseurs/tous"
                  label="Mes Fournisseurs"
                  pathname
                />
                <NavLink
                  path="/ingredients/tous"
                  label="Mes Ingrédients"
                  pathname
                />
                <NavLink
                  path="/commandes/toutes"
                  label="Mes Commandes"
                  pathname
                />
              </Nav>
              <Nav className="ml-auto">
                <NavLink path="/panier/main" label="Mon Panier" pathname />
              </Nav>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  </header>
);

export default withRouter(Header);
