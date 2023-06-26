import Link from "next/link";
import { withRouter } from "next/router";
import classNames from "classnames";
import { Container, Navbar, Nav } from "react-bootstrap";

export const NavLink = (props) => {
  let className = classNames({
    "nav-link": true,
    "is-active": props.pathname,
  });
  return (
    <Link href={props.path} style={{ textDecoration: "none", color: "black" }}>
      <p className={className}>{props.label}</p>
    </Link>
  );
};

const Header = ({ router: { pathname } }) => (
  <header>
    <div id="wrapper-navbar">
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand>Order n'Cook</Navbar.Brand>
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
