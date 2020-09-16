import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import ProTip from '../components/ProTip';
import Link from '../components/Link';
import Copyright from '../components/Copyright';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import { formium } from '../lib/formium';

export default function Index({ forms }) {
  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Formium Forms
        </Typography>
        <Divider />
        <List>
          {forms.map(form => (
            <ListItem>
              <Link
                key={form.id}
                href="/forms/[slug]"
                as={`/forms/${form.slug}`}
                color="secondary"
              >
                {form.name}
              </Link>
            </ListItem>
          ))}
        </List>
        <ProTip />
        <Copyright />
      </Box>
    </Container>
  );
}

export const getStaticProps = async () => {
  // Fetch all the forms in the project
  const { data: forms } = await formium.findForms();
  return { props: { forms } };
};
