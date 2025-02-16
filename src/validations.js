export function errorsFirebase(error) {
  switch (error) {
    case 'auth/invalid-email':
      return 'Insira um e-mail válido';
    case 'auth/user-not-found':
      return 'O e-mail inserido não está cadastrado';
    case 'auth/email-already-in-use':
      return 'O e-mail inserido já possui cadastro';
    case 'auth/weak-password':
      return 'A senha deve ter 6 ou mais caracteres';
    case 'auth/invalid-password':
      return 'Senha inválida';
    case 'auth/wrong-password':
      return 'Usuário e/ou senha incorretos';
    case 'auth/missing-email':
      return 'Insira o e-mail para a recuperação da senha';
    default:
      return '';
  }
}

export function validateRegister(name, sobrenome, email, password) {
  if (!name && !sobrenome && !password && !email) {
    return 'Preencha todos os campos';
  }

  if (name === '') {
    return 'Insira um nome';
  }
  if (sobrenome === '') {
    return 'Insira um sobrenome';
  }
  if (email === '') {
    return 'Insira um e-mail';
  }

  if (email === false) {
    return 'Insira um e-mail válido (ex: nome@email.com)';
  }
  if (password === '') {
    return 'Digite sua senha';
  }

  return '';
}
