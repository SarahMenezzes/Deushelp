// src/DataFetcher.tsx
import React, { useState } from 'react';
import styled from 'styled-components';

// Defina estilos com styled-components
const Container = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
`;

const Loading = styled.p`
  font-size: 18px;
  color: #ff0000;
`;

const Error = styled.p`
  font-size: 18px;
  color: #ff0000;
`;

const DataContainer = styled.div`
  font-size: 16px;
  background-color: #f4f4f4;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
`;

const DataList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const DataListItem = styled.li`
  margin-bottom: 10px;
`;

const InputContainer = styled.div`
  margin-bottom: 20px;
`;

const Input = styled.input`
  font-size: 16px;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  font-size: 16px;
  padding: 8px 16px;
  margin-left: 10px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const UserProfileContainer = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const Avatar = styled.img`
  border-radius: 50%;
  width: 100px;
  height: 100px;
  margin-bottom: 10px;
`;

// Defina as interfaces para os dados recebidos
interface Owner {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
}

interface RepoData {
  id: number;
  name: string;
  full_name: string;
  owner: Owner;
  private: boolean;
  html_url: string;
}

const DataFetcher: React.FC = () => {
  const [user, setUser] = useState<string>(''); // Estado para o nome do usuário
  const [data, setData] = useState<RepoData[] | null>(null);
  const [userData, setUserData] = useState<Owner | null>(null); // Novo estado para dados do usuário
  const [loading, setLoading] = useState<boolean>(false); // Inicialmente não está carregando
  const [error, setError] = useState<string | null>(null);

  const fetchData = () => {
    if (user.trim() === '') return; // Não faz nada se o campo estiver vazio
    setLoading(true);
    setError(null);

    // Buscar dados do usuário e repositórios
    Promise.all([
      fetch(`https://api.github.com/users/${user}`),
      fetch(`https://api.github.com/users/${user}/repos`)
    ])
    .then(([userResponse, reposResponse]) => {
      if (!userResponse.ok || !reposResponse.ok) {
        ;
      }
      return Promise.all([userResponse.json(), reposResponse.json()]);
    })
    .then(([userData, reposData]: [Owner, RepoData[]]) => {
      setUserData(userData);
      setData(reposData);
      setLoading(false);
    })
    .catch((error: unknown) => {
      if (error instanceof Error) {
        setError;
      } else {
        setError('Unknown error occurred');
      }
      setLoading(false);
    });
  };

  return (
    <Container>
      <InputContainer>
        <Input
          type="text"
          placeholder="GitHub username"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
        <Button onClick={fetchData}>Buscar Repositórios</Button>
      </InputContainer>
      {loading && <Loading>Loading...</Loading>}
      {error && <Error>Error: {error}</Error>}
      {userData && (
        <UserProfileContainer>
          <Avatar src={userData.avatar_url} alt={`${userData.login}'s avatar`} />
          <p>{userData.login}</p>
        </UserProfileContainer>
      )}
      {data && (
        <DataContainer>
          <Title>Repositórios</Title>
          <DataList>
            {data.map(repo => (
              <DataListItem key={repo.id}>
                <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                  {repo.name}
                </a>
              </DataListItem>
            ))}
          </DataList>
        </DataContainer>
      )}
    </Container>
  );
};

export default DataFetcher;
